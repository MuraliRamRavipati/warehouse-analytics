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

const SubCategories = () => {
    const [loggedInUser, setLoggedInUser] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategoryName, setSubCategoryName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);

    const handleButtonClick = async () => {
        if (!categories.length) {
            try {
                const res = await axios.get('http://localhost:3000/category');
                setCategories(res.data.data);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setError(true);
                setLoading(false);
            }
        }
        setOpen(true);
    }

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try{
            const res = await axios.delete(`http://localhost:3000/sub-category/${id}`);
            const filtered = subCategories.filter(w => w.id !== id);
            setSubCategories(filtered);
            setLoading(false);
        }catch(e){
            console.log(e);
            setError(true);
            setLoading(false);
        }
    }

    const addNewSubCategory = async () => {
        try{
            const res = await axios.post('http://localhost:3000/sub-category', {name:subCategoryName, categoryId}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const res2 = await axios.get(`http://localhost:3000/category/${categoryId}`);
            const category = res2.data.data

            setSubCategories([
                ...subCategories,
                {
                    id: res.data.data.id,
                    name: subCategoryName,
                    categoryName: category[0].name
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

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await axios.get('http://localhost:3000/sub-category');
                setSubCategories(res.data.data);
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

        getUsers();
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
                        <h1>Add Sub-Category</h1>
                        {
                            error && <span style={{ color: 'red' }}>Error</span>
                        }
                        <TextField onChange={(e) => setSubCategoryName(e.target.value)} fullWidth id="filled-basic" label="Sub-Category Name" variant="filled" style={{ width: 500 }} />
                        <Select
                            variant="filled"
                            value={categoryId}
                            fullWidth
                            displayEmpty
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <MenuItem value="">Select Category</MenuItem>
                            {
                                categories.map((category, i) => <MenuItem key={i} value={category.id}>{category.name}</MenuItem>)
                            }
                        </Select>

                        <Button disabled={loading} variant="outlined" style={{ width: '300px', marginTop: '30px' }} onClick={addNewSubCategory}>Add</Button>
                    </Grid>
                </Box>
            </Modal>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h2> Sub-Categories: </h2>
                    {
                        loggedInUser.roleId === 2 &&
                        <Button sx={{ borderRadius: 8 }} variant="outlined" onClick={handleButtonClick}>
                            +
                        </Button>

                    }
                </Grid>
                {
                    subCategories.map((subCategory, i) => {
                        return <Grid item xs={4} key={i} style={{ textDecoration: 'none' }}>
                            <Paper
                                style={{ cursor: "pointer" }}
                                sx={{
                                    height: 165,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                }}
                            >
                                <div style={{ padding: '20px' }}>
                                    <p><b>Sub-Category Name :</b> {subCategory.name} </p>
                                    <p><b>Category Name :</b> {subCategory.categoryName} </p>
                                    {loggedInUser.roleId === 2 && <span><Button onClick={(e) => handleDelete(e, subCategory.id)}>Delete</Button></span>}
                                </div>
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </div>

    )
}

export default SubCategories;