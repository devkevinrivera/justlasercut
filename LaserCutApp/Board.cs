using netDxf;
using netDxf.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LaserCutApp
{
    public class Board
    {
        public readonly BoundingRectangle Bounding;
        public Board(BoundingRectangle box)
        {
            Bounding = box;
            Objects = new List<EntityObject>();
        }
        public List<EntityObject> Objects { get; set; }
    }
}
