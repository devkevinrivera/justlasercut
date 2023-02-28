import React, { useEffect } from 'react';
import { Container, Grid, Header, Icon, Button } from 'semantic-ui-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useBackoffice } from "../../../hooks/useBackoffice";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' ,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];


export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => 40),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => 80),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const Dashboard = () => {

	const { 
		getTotalPedidos,
		getTotalMaterials,
		totalGanancias,
		totalPedidos,
		totalMaterials 
	} = useBackoffice();

	useEffect(() => {
		getTotalPedidos();
		getTotalMaterials();
	},[]);
	
	return (
		<Container>
			<Grid>
				<Grid.Row>
						<Grid.Column computer={8}>
							<div className="dash-card">
								<Header as='h4'>Ingresos</Header>
								<Header as='h3'>{totalGanancias} €</Header>
								<div>
									<Line options={options} data={data} />
								</div>
							</div>
						</Grid.Column>
						<Grid.Column computer={4}>
							<div className="dash-card">
								<div className="dash-card__title">
									<h4>Ventas Hoy</h4>
									<Button>
										<Icon name="shopping bag" />
									</Button>
								</div>
								<div className="dash-card__value">
									<h2>$120</h2>
								</div>
								<p>* Se actualiza cada día</p>
							</div>

							<div className="dash-card">
								<div className="dash-card__title">
									<h4>Materiales</h4>
									<Button>
										<Icon name="sitemap" />
									</Button>
								</div>
								<div className="dash-card__value">
									<h2>{totalMaterials}</h2>
								</div>
								<p>* Se actualiza cada día</p>
							</div>
						</Grid.Column>
						<Grid.Column computer={4}>
						<div className="dash-card">
								<div className="dash-card__title">
									<h4>Pedidos totales</h4>
									<Button>
										<Icon name="money" />
									</Button>
								</div>
								<div className="dash-card__value">
									<h2>{totalPedidos}</h2>
								</div>
								<p>* Se actualiza cada día</p>
							</div>

							<div className="dash-card">
								<div className="dash-card__title">
									<h4>Visitantes hoy</h4>
									<Button>
										<Icon name="users" />
									</Button>
								</div>
								<div className="dash-card__value">
									<h2>45</h2>
								</div>
								<p>* Se actualiza cada día</p>
							</div>
						</Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
	);
};

export default Dashboard;