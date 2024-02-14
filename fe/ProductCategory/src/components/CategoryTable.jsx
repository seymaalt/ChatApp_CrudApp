import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Container from '@mui/material/Container';

export default function BasicTable() {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [category, setCategory] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: ""
  });
  const [updatedCategory, setUpdatedCategory] = useState({
    name: ""
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3005/categories");
      setCategory(response.data.categories);
      console.log(response.data.categories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteProduct = async (Id) => {
    try {
      await axios.delete(`http://localhost:3005/categories/${Id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post("http://localhost:3005/categories", {
        name: newCategory.name,
      
      });
      fetchData(); // Refresh the product list after addition
      setNewCategory({ name: ""});
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async (Id) => {
    try {
        await axios.put(
            `http://localhost:3005/categories/${Id}`,
            {
              name: updatedCategory.name,
  
            }
          );
      fetchData(); // Refresh the product list after update
      handleCloseUpdateModal();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleOpenUpdateModal = (Id) => {
    setSelectedProductId(Id);
    setUpdateModalOpen(true);
    const selectedCategory = category.find(
      (categories) => categories.id === Id
    );
    setUpdatedCategory(selectedCategory);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedProductId(null);
    setUpdatedCategory({
      name: ""
    });
  };

  return (
    <>
     <Container fixed>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TextField
                  label="Name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={handleAddProduct}
                  variant="contained"
                  color="primary"
                 
                >
                  Add category
                </Button>
              </TableCell>

            </TableRow>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {category && category.length > 0 ? (
    category.map((categories) => (
      <TableRow key={categories.id}>
        <TableCell>{categories.id}</TableCell>
        <TableCell>{categories.name}</TableCell>
       
        <TableCell>
          <IconButton onClick={() => handleOpenUpdateModal(categories.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteProduct(categories.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={3}>No categories available</TableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
        <Modal
          open={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          aria-labelledby="update-modal"
          aria-describedby="update-product-details"
        >
          <Paper>
            <Stack p={2}>
              <TextField
                label="Name"
                value={updatedCategory.name}
                onChange={(e) =>
                  setUpdatedCategory({ ...updatedCategory, name: e.target.value })
                }
              />
             
              
              <Button
                onClick={() => handleUpdateProduct(selectedProductId)}
                variant="contained"
                color="primary"
              >
                Update category
              </Button>
            </Stack>
          </Paper>
        </Modal>
      </TableContainer>
      </Container>
    </>
  );
}
