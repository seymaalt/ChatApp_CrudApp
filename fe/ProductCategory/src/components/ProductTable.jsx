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
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category_id: "",
  });
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    price: "",
    category_id: "",
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3005/products");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3005/products/${productId}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post("http://localhost:3005/products", {
        name: newProduct.name,
        price: newProduct.price,
        categoryId: newProduct.category_id,
      });
      fetchData(); // Refresh the product list after addition
      setNewProduct({ name: "", price: "", category_id: "" });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async (productId) => {
    try {
        await axios.put(
            `http://localhost:3005/products/${productId}`,
            {
              name: updatedProduct.name,
              price: updatedProduct.price,
              categoryId: updatedProduct.category_id,
            }
          );
      fetchData(); // Refresh the product list after update
      handleCloseUpdateModal();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleOpenUpdateModal = (productId) => {
    setSelectedProductId(productId);
    setUpdateModalOpen(true);
    const selectedProduct = products.find(
      (product) => product.id === productId
    );
    setUpdatedProduct(selectedProduct);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedProductId(null);
    setUpdatedProduct({
      name: "",
      price: "",
      category_id: "",
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
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Category ID"
                  value={newProduct.category_id}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      category_id: e.target.value,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={handleAddProduct}
                  variant="contained"
                  color="primary"
                >
                  Add Product
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category_id}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenUpdateModal(product.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteProduct(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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
                value={updatedProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                }
              />
              <TextField
                label="Price"
                value={updatedProduct.price}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    price: e.target.value,
                  })
                }
              />
              <TextField
                label="Category ID"
                value={updatedProduct.category_id}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    category_id: e.target.value,
                  })
                }
              />
              <Button
                onClick={() => handleUpdateProduct(selectedProductId)}
                variant="contained"
                color="primary"
              >
                Update Product
              </Button>
            </Stack>
          </Paper>
        </Modal>
      </TableContainer>
      </Container>

    </>
  );
}
