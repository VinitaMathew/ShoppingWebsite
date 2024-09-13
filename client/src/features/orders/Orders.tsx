import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Order } from "../../app/models/orders";
import { currencyFormat } from "../../app/util/util";
import BasketTable from "../basket/BasketTable";
import { BasketItem } from "../../app/models/basket";
import BasketSummary from "../basket/BasketSummary";

export default function Orders() {
  const [orders, setOrders] = useState<Order[] | null>();
  const [loading, setLoading] = useState(true);
  const [isOrderDetails, setIsOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    agent.Orders.list()
      .then((orders) => setOrders(orders))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  const handleViewClick = (order: Order | null) => {
    setIsOrderDetails(!isOrderDetails);
    setSelectedOrder(order);
  };

  if (loading) return <LoadingComponent message="Loading orders..." />;

  if (isOrderDetails && selectedOrder)
    return (
      <>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ p: 2 }} gutterBottom variant="h4">
            Order#{selectedOrder.id} - {selectedOrder.orderStatus}
          </Typography>
          <Button
            onClick={() => handleViewClick(null)}
            sx={{ m: 2 }}
            size="large"
            variant="contained"
          >
            BACK TO ORDERS
          </Button>
        </Box>
        <BasketTable
          items={selectedOrder.orderItems as BasketItem[]}
          isBasket={false}
        />
        <Grid container>
          <Grid item xs={6} />
          <Grid item xs={6}>
            <BasketSummary
              basketItems={selectedOrder.orderItems as BasketItem[]}
            />
          </Grid>
        </Grid>
      </>
    );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order number</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Order Date</TableCell>
            <TableCell align="right">Order Status</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order) => (
            <TableRow
              key={order.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {order.id}
              </TableCell>
              <TableCell align="right">{currencyFormat(order.total)}</TableCell>
              <TableCell align="right">
                {order.orderDate.split("T")[0]}
              </TableCell>
              <TableCell align="right">{order.orderStatus}</TableCell>
              <TableCell align="right">
                <Button onClick={() => handleViewClick(order)}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
