import { useEffect, useState } from "react";
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const Categories = () => {
    const [loggedInUser, setLoggedInUser] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);

    const handleButtonClick = async () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try{
            const res = await axios.delete(`http://localhost:3000/category/${id}`);
            const filtered = categories.filter(w => w.id !== id);
            setCategories(filtered);
            setLoading(false);
        }catch(e){
            console.log(e);
            setError(true);
            setLoading(false);
        }
    }

    const addNewCategory = async () => {
        try{
            const res = await axios.post('http://localhost:3000/category', {name: categoryName}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setCategories([
                ...categories,
                {
                    id: res.data.data.id,
                    name: categoryName,
                }
            ]);
            setLoading(false);
        }catch(e){
            console.log(e);
            setError(true);
            setLoading(false);
        }
        setOpen(false);
    }

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await axios.get('http://localhost:3000/category');
                setCategories(res.data.data);
                console.log(res.data.data);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setError(true);
                setLoading(false);
            }
        };

        const getLoggedInUser = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const res = await axios.get(`http://localhost:3000/user/${user.username}`);
                setLoggedInUser(res.data.data[0]);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setError(true);
                setLoading(false);
            }
        };

        getCategories();
        getLoggedInUser();
    }, []);

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={{ ...style }}>
                    <Grid container alignItems="center" justify="center" direction="column" style={{ marginTop: '10px' }}>
                        <h1>Add Category</h1>
                        {
                            error && <span style={{ color: 'red' }}>Error</span>
                        }
                        <TextField onChange={(e) => setCategoryName(e.target.value)} fullWidth id="filled-basic" label="Name" variant="filled" style={{ width: 500 }} />

                        <Button disabled={loading} variant="outlined" style={{ width: '300px', marginTop: '30px' }} onClick={addNewCategory}>Add</Button>
                    </Grid>
                </Box>
            </Modal>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h2> Categories: </h2>
                    {
                        loggedInUser.roleId === 2 &&
                        <Button sx={{ borderRadius: 8 }} variant="outlined" onClick={handleButtonClick}>
                            +
                        </Button>

                    }
                </Grid>
                {
                    categories.map((category, i) => {
                        return <Grid item xs={4} key={i} style={{ textDecoration: 'none' }}>
                            <Paper style={{ cursor: "pointer" }}
                                sx={{
                                    height: 125,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                }}
                            >
                                <div style={{ padding: '20px' }}>
                                    <p><b>Category Name :</b> {category.name} </p>
                                    {loggedInUser.roleId === 2 && <span><Button onClick={(e) => handleDelete(e, category.id)}>Delete</Button></span>}
                                </div>
                            </Paper>

                        </Grid>
                    })
                }
            </Grid>
        </div>

    )
}

export default Categories;