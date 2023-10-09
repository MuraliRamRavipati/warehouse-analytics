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
import Categories from "../Categories";

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

const Items = () => {
    const [loggedInUser, setLoggedInUser] = useState([]);
    const [items, setItems] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);

    const handleButtonClick = async () => {
        if (!subCategories.length) {
            try {
                const res = await axios.get('http://localhost:3000/sub-category');
                setSubCategories(res.data.data);
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
        try {
            const res = await axios.delete(`http://localhost:3000/item/${id}`);
            const filtered = items.filter(w => w.id !== id);
            setItems(filtered);
            setLoading(false);
        } catch (e) {
            console.log(e);
            setError(true);
            setLoading(false);
        }
    }

    const addNewItem = async () => {
        try {
            const res3 = await axios.get(`http://localhost:3000/sub-category/${subCategoryId}`);
            const subCategory = res3.data.data;

            const res = await axios.post('http://localhost:3000/item', { name: itemName, categoryId: subCategory[0].categoryId, subCategoryId, description }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const res2 = await axios.get(`http://localhost:3000/sub-categoryAll/${subCategoryId}`);
            const subCategoryData = res2.data.data;

            setItems([
                ...items,
                {
                    id: res.data.data.id,
                    name: itemName,
                    subCategory: subCategoryData[0].name,
                    category: subCategoryData[0].categoryName,
                    description
                }
            ]);
            setLoading(false);
        } catch (e) {
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
        const getItems = async () => {
            try {
                const res = await axios.get('http://localhost:3000/item');
                setItems(res.data.data);
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

        getItems();
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
                        <h1>Add User</h1>
                        {
                            error && <span style={{ color: 'red' }}>Error</span>
                        }
                        <TextField onChange={(e) => setItemName(e.target.value)} fullWidth id="filled-basic" label="Item Name" variant="filled" style={{ width: 500 }} />
                        <TextField onChange={(e) => setDescription(e.target.value)} fullWidth id="filled-basic" label="Item Description" variant="filled" style={{ width: 500 }} />
                        <Select
                            variant="filled"
                            value={subCategoryId}
                            fullWidth
                            displayEmpty
                            onChange={(e) => setSubCategoryId(e.target.value)}
                        >
                            <MenuItem value="">Select Sub-Category</MenuItem>
                            {
                                subCategories.map((subCategory, i) => <MenuItem key={i} value={subCategory.id}>{subCategory.name}</MenuItem>)
                            }
                        </Select>

                        <Button disabled={loading} variant="outlined" style={{ width: '300px', marginTop: '30px' }} onClick={addNewItem}>Add</Button>
                    </Grid>
                </Box>
            </Modal>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h2> Items: </h2>
                    {
                        loggedInUser.roleId === 2 &&
                        <Button sx={{ borderRadius: 8 }} variant="outlined" onClick={handleButtonClick}>
                            +
                        </Button>

                    }
                </Grid>
                {
                    items.map((item, i) => {
                        return <Grid item xs={4} key={i} style={{ textDecoration: 'none' }}>
                            <Paper

                                style={{ cursor: "pointer" }}
                                sx={{
                                    height: 230,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                }}
                            >
                                <div style={{ padding: '20px' }}>
                                    <p><b>Item Name :</b> {item.name} </p>
                                    <p><b>Sub-Category Name :</b> {item.subCategory} </p>
                                    <p><b>Category Name :</b> {item.category} </p>
                                    <p><b>Description :</b> {item.description} </p>
                                    {loggedInUser.roleId === 2 && <span><Button onClick={(e) => handleDelete(e, item.id)}>Delete</Button></span>}
                                </div>
                            </Paper>

                        </Grid>
                    })
                }
            </Grid>
        </div>

    )
}

export default Items;