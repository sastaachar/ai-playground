import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Typography,
  Button,
  Paper,
  styled,
} from "@mui/material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
    backgroundColor: theme.palette.action.hover,
  },
}));

export const DeploimentList: React.FC = () => {
  const [listData, setListData] = useState([]);

  const getList = async () => {
    try {
      const dataList = await fetch(window.location.origin + "/api/deployment/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "demo",
          host: "test",
        }),
      });
      const data = await dataList.json();
      setListData(data);
    } catch (error) {
      console.error("Error fetching deployment list:", error);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Grid container spacing={2} justifyContent="center" padding={3}>
      <Grid item xs={12} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Deployment List
        </Typography>
      </Grid>
      <Grid item xs={12} textAlign="center">
        <Button variant="contained" onClick={getList}>
          Get Updated List
        </Button>
      </Grid>
      <Grid item xs={12}>
        {listData.map((item: any) => (
          <StyledPaper key={item.id} elevation={2}>
            <Link
              to={`/deployment/${item.id}`}
              style={{ textDecoration: "none", display: "block", color: "inherit" }}
            >
              <Typography variant="h6">ID: {item.id}</Typography>
              <Typography variant="body2">
                Created At: {new Date(item.createdAt).toLocaleString()}
              </Typography>
            </Link>
          </StyledPaper>
        ))}
      </Grid>
    </Grid>
  );
};