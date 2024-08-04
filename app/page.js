"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Container,
} from "@mui/material";
import { firestore } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory(inventory);
    setFilteredInventory(inventory);
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const updateItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    const { quantity } = docSnap.data();
    await setDoc(docRef, { quantity: quantity + 1 });
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const FilterRecords = () => {
    if (searchTerm.trim() === "") {
      setFilteredInventory(inventory);
    } else {
      const filtered = inventory.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInventory(filtered);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={"1px solid #333"}>
        <Box
          width="800px"
          height="100px"
          bgcolor={"#ADD8E6"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
            Inventory Items
          </Typography>
        </Box>
      </Box>
      <Container>
        <Box>
          <TextField
            id="searchbar"
            sx={{ width: 600, ml: 28, mt: 4 }}
            placeholder="Search Here"
            onChange={(e) => setSearchTerm(e.target.value)}
          ></TextField>
          <Button
            onClick={FilterRecords}
            id="searchbtn"
            variant="contained"
            sx={{ mt: 5, ml: 4 }}
          >
            Search
          </Button>
        </Box>
      </Container>
      {(filteredInventory.length > 0 ? filteredInventory : inventory).map(
        ({ name, quantity }) => (
          <Card
            sx={{
              mt: 4,
              width: 600,
              display: "flex",
              justifyContent: "flex-start",
              border: "1px solid #333",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              bgcolor: "#f0f0f0",
            }}
            variant="outlined"
          >
            <CardHeader title={name} sx={{ mr: 12 }} />
            <CardContent>
              <Typography sx={{ fontSize: 18 }}>
                Quantity: {quantity}
              </Typography>
            </CardContent>
            <Button variant="contained" onClick={() => updateItem(name)}>
              Add
            </Button>
            <Button variant="contained" onClick={() => removeItem(name)}>
              Remove
            </Button>
          </Card>
        )
      )}
    </Box>
  );
}
