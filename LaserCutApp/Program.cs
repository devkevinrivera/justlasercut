using netDxf;
using netDxf.Entities;
using netDxf.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;

namespace LaserCutApp
{
    class Program
    {
        static void Main(string[] args)
        {   
            String line;
            String name = "";
            try {
                StreamReader sr = new StreamReader("LaserCutApp/file.txt");
                line = sr.ReadLine();

                while (line != null ) {
                    if(line.Contains("dxf")) {
                        name = line;
                    }
                    line = sr.ReadLine();
                }
                sr.Close();
            } catch (Exception e) {
                Console.WriteLine("Exception: " + e.Message);
            }
            string path = @"C:/Users/Administrator/Documents/justlasercut/justlasercut/LaserCutApp/test/" + name;
            
            IEnumerable<EntityType> ValidEntities = new List<EntityType>()
            {
                EntityType.Arc,
                EntityType.Circle,
                EntityType.Ellipse,
                EntityType.Line,
                EntityType.Polyline,
                EntityType.LwPolyline,
                EntityType.Spline,
            };
            IEnumerable<string> layers = new List<string>()
            {
                "Material",
                "comentarios",
                "Corte exterior",
                "Corte interior",
                "grabado linea alto",
                "Grabado linea bajo",
                "grabado linea medio",
                "Grabado superficie",
            };

            DxfDocument dxf = DxfDocument.Load(path);

            var entities = dxf.Layouts[dxf.ActiveLayout].AssociatedBlock.Entities;

            //Validando Layers
            var groupByLayer = entities
                .GroupBy(e => e.Layer.Name, StringComparer.OrdinalIgnoreCase)
                .Select(g => g.Key);

            var additionalLayers = groupByLayer.Except(layers);
            if (additionalLayers.Any())
            {
                Console.WriteLine("[ERR] Se han encontrado elementos en capas no reconocidas");
                foreach (var layer in additionalLayers)
                {
                    Console.WriteLine(" - {0}", layer);
                }
                Console.WriteLine("[ERR] Comprueba tu archivo para evitar errores.");
                Console.WriteLine();
            }

            // Validate entities
            var entitiesObject = entities.Where(e => layers.Skip(2).Contains(e.Layer.Name)).Select(e => e);

            var groupByEntities = entitiesObject
                .GroupBy(e => e.Type)
                .Select(g => g.Key);

            var invalidEntities = groupByEntities.Except(ValidEntities);

            if (invalidEntities.Any())
            {
                entitiesObject = entitiesObject
                    .Where(e => ValidEntities.Contains(e.Type))
                    .Select(e => e);

                Console.WriteLine("[ERR] Hemos encontrado elementos que el programa no reconoce, comprueba la lista de elemntos válidos");
                foreach (var e in invalidEntities)
                {
                    Console.WriteLine("   - {0}", e);
                }
                Console.WriteLine();
            }

            //Get boards
            List<Board> boards = new List<Board>();
            foreach (var entity in entities)
            {
                if ((entity.Layer.Name == layers.First()) &&
                    ((entity.Type == EntityType.Polyline) ||
                     (entity.Type == EntityType.LwPolyline)
                    )
                   )
                {
                    Board board = new Board((entity as IGeometric).GetBoundingBox());
                    boards.Add(board);
                }
            }

            // agrupando entities en Boards
            foreach (var entity in entitiesObject)
            {
                foreach (var board in boards)
                {
                    var bounding = board.Bounding;
                    var box = new BoundingRectangle(bounding.Min + new Vector2(1.0, 1.0), bounding.Max - new Vector2(1.0, 1.0));
                    var flag1 = (entity as IGeometric).InsideBox(box);
                    var flag2 = (entity as IGeometric).InsideBox(bounding);

                    if (flag1 || flag2)
                    {
                        board.Objects.Add(entity);
                        if (!(flag1 && flag2))
                        {
                            Console.WriteLine("El objeto se encuentre en el limite del margen de seguridad");
                        }
                        break;
                    }

                    if (board.Equals(boards.Last()))
                    {
                        Console.WriteLine("El objeto se encuentre fuera del marco");
                    }
                }

            }

            foreach (var board in boards)
            {
                
                Console.WriteLine("[BOARD]-{1:f}-{2}-{3}", board.Bounding.Height, board.Bounding.Width, board.Objects.Count, boards.Count);
                var group = board.Objects.GroupBy(o => o.Layer.Name)
                    .Select(g => new
                    {
                        Layer = g.Key,
                        Length = g.Sum(s => (s as IGeometric).Length()),
                        Points = g.Sum(s => (s as IGeometric).Point())
                    }
                    );
                if (!group.Any())
                {
                    Console.WriteLine("No se encontraron Objetos dentro del marco");
                }
                foreach (var o in group)
                {
                    Console.WriteLine("[TYPE]-{0}-{1:f}-{2}", o.Layer, o.Length, o.Points);
                }
                Console.WriteLine("PLANCHA");

                var gSuperficie = board.Objects
                                    .Where(o => o.Layer.Name == layers.Last())
                                    .Select(e => e).OfType<IGeometric>(); ;

                if (!gSuperficie.Any())
                {
                    Console.WriteLine("");
                    continue;
                }

                var validObjects = gSuperficie.Where(o => !o.IsClosed()).Select(e => e);
                if (validObjects.Any())
                {
                    Console.WriteLine("Existen objetos que no se encuentran cerrados.");
                    continue;
                }

                BoundingRectangle bounding = null;
                foreach (var entity in gSuperficie)
                {
                    if (bounding == null)
                    {
                        bounding = entity.GetBoundingBox();
                    }
                    else
                    {
                        bounding = BoundingRectangle.Union(bounding, entity.GetBoundingBox());
                    }
                }

                var minY = bounding.Min.Y;
                var maxY = bounding.Max.Y;
                double interval = 1.0;
                int n = Convert.ToInt32((maxY - minY) / interval);
                double longitud = 0.0;
                for (int i = 0; i <= n; i++)
                {
                    double y = minY + i * interval;
                    double maxX = double.MinValue;
                    double minX = double.MaxValue;
                    bool isIntersec = false;
                    foreach (var o in gSuperficie)
                    {
                        if (o.HorizontalIntersection(y, out double min, out double max))
                        {
                            isIntersec = true;
                            if (min < minX) minX = min;
                            if (max > maxX) maxX = max;
                        }
                    }
                    if (isIntersec) 
                    {
                        Console.WriteLine($"---{maxX - minX}");
                        longitud += maxX - minX;
                    }
                }

                Console.WriteLine($"grabado superficie : {longitud}");
                Console.WriteLine("");
            }
            Console.ReadKey();
        }
    }
}
