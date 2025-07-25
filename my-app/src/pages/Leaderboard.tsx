import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
} from "@mui/material";
import api from "../api";
import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import { visuallyHidden } from "@mui/utils";

interface Data {
  username: string;
  stockHoldings: number;
  portfolio: number;
}

function createData(
  username: string,
  stockHoldings: number,
  portfolio: number
): Data {
  return {
    username,
    stockHoldings,
    portfolio,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number }, b: { [key in Key]: number }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  id: keyof Data;
  label: string;
  disableSorting: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "username",
    label: "Rank",
    disableSorting: true,
  },
  {
    id: "stockHoldings",
    label: "Stock Holdings",
    disableSorting: false,
  },
  {
    id: "portfolio",
    label: "Total Portfolio Value",
    disableSorting: false,
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.disableSorting ? "left" : "right"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.disableSorting ? (
              headCell.label
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function LeaderboardPage() {
  const [mode, setMode] = useState("global");
  const [leaders, setLeaders] = useState<any[]>([]);
  const username = localStorage.getItem("username");
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof Data>("portfolio");

  const fetchLeaders = async () => {
    try {
      const res = await api.get(`/leaderboard/${mode}/`, {
        withCredentials: true,
      });
      setLeaders(
        res.data.map((row: any) =>
          createData(row.username, row.stock_holdings, row.portfolio_value)
        )
      );
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, [mode]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  return (
    <>
      <Header user={username} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {mode === "global" ? "Global Leaderboard" : "Local Leaderboard"}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(e, newMode) => newMode && setMode(newMode)}
            sx={{ mb: 3 }}
          >
            <ToggleButton value="global">Global</ToggleButton>
            <ToggleButton value="local">Local</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {leaders
                    .sort(getComparator(order, orderBy))
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.username}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell align="right" sx={{ maxWidth: "5rem" }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                sx={{ fontSize: "1.2rem" }}
                              >
                                #{index + 1}
                              </Typography>
                              <ProfileCard
                                username={row.username}
                                bgcolor="#e3f2fd"
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {row.stockHoldings.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {row.portfolio.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Container>

      {/* <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {mode === "global" ? "Global Leaderboard" : "Local Leaderboard"}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(e, newMode) => newMode && setMode(newMode)}
            sx={{ mb: 3 }}
          >
            <ToggleButton value="global">Global</ToggleButton>
            <ToggleButton value="local">Local</ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(e, newMode) => newMode && setMode(newMode)}
            sx={{ mb: 3 }}
          >
            <ToggleButton value="global">
              Stock Holdings
              <SwapVertIcon />
            </ToggleButton>
            <ToggleButton value="local">
              Portfolio
              <SwapVertIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Paper sx={{ p: 2, mb: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" fontWeight="bold">
              Rank
            </Typography>
            <Box display="flex">
              <Typography variant="body1" fontWeight="bold">
                Stock Holdings Value
              </Typography>
              <SwapVertIcon />
            </Box>
            <Box display="flex">
              <Typography variant="body1" fontWeight="bold">
                Portfolio Value
              </Typography>
              <SwapVertIcon />
            </Box>
          </Box>
        </Paper>

        {leaders.map((user, index) => (
          <Paper key={user.username} sx={{ p: 2, mb: 1 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ fontSize: "1.2rem" }}
                >
                  #{index + 1}
                </Typography>
                <ProfileCard username={user.username} bgcolor="#e3f2fd" />
              </Box>

              <Typography
                variant="body2"
                fontWeight="medium"
                sx={{ fontSize: "1.2rem" }}
              >
                ${user.stock_holdings.toFixed(2)}
              </Typography>

              <Typography
                variant="body2"
                fontWeight="medium"
                sx={{ fontSize: "1.2rem" }}
              >
                ${user.portfolio_value.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Container> */}
    </>
  );
}

export default LeaderboardPage;
