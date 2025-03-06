import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Paper, styled, Tooltip, Divider } from "@mui/material";
import { useAppContext } from "../../context/AppContext";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1.5),
    margin: theme.spacing(0.5, 0),
    backgroundColor: 'rgba(49, 52, 141, 0.06)',
    transition: "background-color 0.2s ease",
    "&:hover": {
        backgroundColor: theme.palette.mode === 'dark' ?
            'rgba(255, 255, 255, 0.1)' :
            'rgba(0, 0, 0, 0.04)',
    },
    borderRadius: '1rem',
    cursor: 'pointer',
    '& a': {
        textDecoration: 'none',
        color: 'inherit',
        display: 'block'
    }
}));

const PanelContainer = styled("aside")(({ theme }) => ({
    width: "260px",
    height: "100vh",
    backgroundColor: theme.palette.background.paper,
    borderLeft: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    position: 'fixed',
    right: 0,
    top: 0,
    boxShadow: theme.shadows[2]
}));

const HeadingContainer = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderTopRightRadius: '8px',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
}));

const ListContainer = styled("div")(({ theme }) => ({
    flexGrow: 1,
    overflowY: "auto",
    paddingRight: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',

    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-track': {
        background: theme.palette.mode === 'dark' ?
            'rgba(255, 255, 255, 0.1)' :
            'rgba(0, 0, 0, 0.05)',
        borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.mode === 'dark' ?
            'rgba(255, 255, 255, 0.2)' :
            'rgba(0, 0, 0, 0.2)',
        borderRadius: '3px',
    }
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    alignSelf: 'flex-start',
    fontSize: '0.75rem',
    padding: theme.spacing(0.5, 1),
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        boxShadow: theme.shadows[1],
        borderRadius: '1rem',
    },
}));

export const DeploimentList: React.FC = () => {
    const [listData, setListData] = useState([]);

    const { username, host } = useAppContext();

    const getList = async () => {
        try {
            const response = await fetch(window.location.origin + "/api/deployment/list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, host }),
            });
            const data = await response.json();
            setListData(data);
        } catch (error) {
            console.error("Error fetching deployment list:", error);
        }
    };

    useEffect(() => { getList(); }, []);

    return (
        <PanelContainer style={{ borderRadius: '15px', height: '96%', maxHeight: '100%' }}>
            <HeadingContainer>
                <Typography variant="subtitle1" gutterBottom sx={{
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: 'text.primary',
                    px: 1,
                    mb: 1
                }}>
                    Deployment History
                </Typography>
                <div style={{ border: '1px solid gray' , borderRadius: '1rem', alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%', height: '60%'}}>
                <StyledButton
                    variant="text"
                    onClick={getList}
                    size="small"
                    sx={{
                        fontWeight: 'bold',
                        color: 'text.secondary',
                        width: '100%',
                        height: '100%',
                        borderRadius: '1rem'
                    }}
                >
                    
                    Refresh list
                </StyledButton>
                </div>
            </HeadingContainer>
            <Divider />
            <ListContainer>
                {listData.map((item: any) => (
                    <StyledPaper key={item.id} elevation={0}>
                        <Tooltip title={`ID: ${item.id} - Created At: ${new Date(item.createdAt).toLocaleString()}`} placement="right">
                            <Link to={`/deployment/${item.id}`} style={{ display: 'block', overflow: 'hidden' }}>
                                <Typography variant="subtitle2" sx={{
                                    fontSize: '0.8125rem',
                                    lineHeight: 1.2,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    padding: '0px'
                                }}>
                                    {item.id}
                                </Typography>
                            </Link>
                        </Tooltip>
                    </StyledPaper>
                ))}
            </ListContainer>
        </PanelContainer>
    );
};