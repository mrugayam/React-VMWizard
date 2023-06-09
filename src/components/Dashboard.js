import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/EditOutlined';
import Refresh from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/LibraryAddOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import StopOutlinedIcon from '@mui/icons-material/StopOutlined';
import AddComment from '@mui/icons-material/AddCommentOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import "../styles/Dashboard.css"
import Modal from "react-modal";
import Alert from 'react-bootstrap/Alert';
import jwtDecode from 'jwt-decode';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Paper, Typography } from "@material-ui/core";
import { FormControl, MenuItem, Box } from '@mui/material';
import TextField from '@mui/material/TextField';

function Dashboard(props) {
    const [VMs, setVMs] = useState(null);
    const duplicate = useRef(true);
    const [Notes, setNotes] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [updatedNote, setUpdatedNote] = useState('');
    const [createForm, setCreateForm] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [VMID, setVMID] = useState(false);
    const decodedToken = jwtDecode(props.token);
    const userRole = decodedToken.role;
    const userID = decodedToken.sub;
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function addNote(){
        if (newNote.trim() !== '') {            
            fetch('http://localhost:5000/note/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + props.token
                },
                body: JSON.stringify({ "user": userID, "VM": VMID, "description": newNote })
            })
                .then(response => response.json())
                .then(data => {
                    data.access_token && props.setToken(data.access_token)
                    console.log(data)
                })
                .catch(error => console.error(error));
        }
        setNewNote('');
        GetNotes(VMID);
    };

    function updateNote(vmID,ID) {                
        fetch('http://localhost:5000/note/' + ID + '/update', {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + props.token
            },
            body: JSON.stringify({ "description": updatedNote, "ID": ID })
        })
            .then(response => response.json())
            .then(data => {
                data.access_token && props.setToken(data.access_token)
                console.log(data)
            })
            .catch(error => console.error(error));
    };

    function deleteNote(ID) {
        fetch('http://localhost:5000/note/' + ID + '/delete', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + props.token
            },

            body: JSON.stringify({ "user": userID }) 
        })
            .then(response => response.json())
            .then(data => {
                data.access_token && props.setToken(data.access_token)
                console.log(data)
            })
            .catch(error => console.error(error));
        GetNotes(VMID);
    }

    const [formData, setFormData] = useState({
        user: userID,
        name: '',
        description: '',
        size: 'Standard_DS1_v2'
    });

    const handleValueChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await fetch('http://localhost:5000/duplicate-vm/' + formData.name, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + props.token
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                data.access_token && props.setToken(data.access_token)
                if (data != "") {                                        
                    alert(data)
                }
                else {
                    setRequestSent(true)
                    duplicate.current = false
                    console.log(duplicate)
                    alert("Form Submitted Successfully")
                }
            })  

        if (!duplicate.current) {
            await fetch('http://localhost:5000/vm/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + props.token
                },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(data => {
                    data.access_token && props.setToken(data.access_token)
                    window.location.reload(true)
                    alert(data)
                })
                .catch(error => console.error(error));
        }
    }


    useEffect(() => {
        if (userRole === "User") {
            fetch('http://localhost:5000/users/' + userID + '/vms', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + props.token
                }
            })
                .then(response => response.json())
                .then(data => {
                    data.access_token && props.setToken(data.access_token)
                    setVMs(data)
                })
                .catch(error => console.error(error));
        }
        if (userRole === "Admin") {
            fetch('http://localhost:5000/vms', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + props.token
                }
            })
                .then(response => response.json())
                .then(data => {
                    data.access_token && props.setToken(data.access_token)
                    setVMs(data)
                })
                .catch(error => console.error(error));
        }        
    }, []);

    function StopVM(vmName, vmID) {
        fetch('http://localhost:5000/vm/' + vmName + '/stop', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + props.token
            },
            body: JSON.stringify({ "user": userID, "VM": vmID})
        })
            .then(response => response.json())
            .then(data => {
                data.access_token && props.setToken(data.access_token)
                alert(data)
            })
            .catch(error => console.error(error));
    }

    function DeleteVM(vmName,vmID) {
        handleClose()
        fetch('http://localhost:5000/vm/' + vmName, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + props.token
            },
            body: JSON.stringify({ "user": userID, "VM": vmID })
        })
            .then(response => response.json())
            .then(data => {
                data.access_token && props.setToken(data.access_token)
                window.location.reload(true)
                alert(data)
            })
            .catch(error => console.error(error));
    }

    function StartVM(vmName,vmID) {
        fetch('http://localhost:5000/vm/' + vmName + '/start', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + props.token
            },
            body: JSON.stringify({ "user": userID, "VM": vmID })
        })
            .then(response => response.json())
            .then(data => {
                data.access_token && props.setToken(data.access_token)
                alert(data)
            })
            .catch(error => console.error(error));
    }

    function RestartVM(vmName, vmID) {
        fetch('http://localhost:5000/vm/' + vmName + '/restart', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + props.token
            },
            body: JSON.stringify({ "user": userID, "VM": vmID })
        })
            .then(response => response.json())
            .then(data => {
                data.access_token && props.setToken(data.access_token)
                alert(data)
            })
            .catch(error => console.error(error));
    }

    function GetNotes(vmID) {
        setVMID(vmID);
        setShowNotes(true);
        fetch('http://localhost:5000/vm/' + vmID + '/notes', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + props.token
            }
        })
            .then(response => response.json())
            .then(data => {
                data.access_token && props.setToken(data.access_token)
                setNotes(data)
                console.log(data)
            })
            .catch(error => console.error(error));
    }

    const sizes = ["Standard_B2s","Standard_DS1_v2","Standard_B1s", "Standard_B2ms"];
    return (
        <div>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setCreateForm(true)}>
                Create VM
            </Button>
            {requestSent && (
                <Alert variant="success" onClose={() => setRequestSent(false)} dismissible>
                    VM creation request has been sent. Please wait a few moments for VM creation
                </Alert>
            )}  
        <div className="square-container">                                 
                <Modal isOpen={createForm} onRequestClose={() => setCreateForm(false)} ariaHideApp={false} >
                    <Box
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '60ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                    <form onSubmit={handleSubmit} >
                        <div>                           
                            <TextField
                                required
                                id="postfix"
                                label="Postfix"
                                name="name"
                                onChange={handleValueChange}
                                defaultValue=""
                            />
                        </div>
                        <TextField
                            required
                            id="description"
                            label="Description"
                            name="description"
                            onChange={handleValueChange}
                            multiline
                            rows={4}
                            defaultValue=""
                        />
                        <div>
                            <TextField
                                id="size"
                                required
                                select
                                onChange={handleValueChange}
                                name="size"
                                label="VM Size"
                                defaultValue="Standard_DS1_v2"
                                helperText="Please select your VM size"
                            >
                                {sizes.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <Button type="submit" variant={"contained"}>
                            Submit
                        </Button>
                            <Button onClick={() => setCreateForm(false)}>Cancel</Button>
                    </form>
                    </Box>
                </Modal>
            <div>
            <div className="grid-container">
                    {VMs?.map((vm) => (
                        <Card sx={{ maxWidth: 345 }} key={vm.ID}>
                            <CardHeader
                            avatar={
                              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                VM
                              </Avatar>
                            }
                            title={vm.Name}
                            subheader={vm.Size}
                          />
                          <CardMedia
                            component="img"
                            height="194"
                            image="https://static-00.iconduck.com/assets.00/virtual-machines-icon-512x464-nlf7gddb.png"
                            alt="VM Image"
                          />
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">                                                                        
                                    {vm.Description}
                            </Typography>
                            </CardContent>
                          <CardActions disableSpacing>
                            <IconButton aria-label="start" onClick={() => StartVM(vm.Name, vm.ID)}>
                                <PlayArrowOutlinedIcon />
                            </IconButton>
                            <IconButton aria-label="stop" onClick={() => StopVM(vm.Name,vm.ID)}>
                                <StopOutlinedIcon />
                            </IconButton> 
                                <IconButton aria-label="restart" onClick={() => RestartVM(vm.Name, vm.ID)}>
                                    <RestartAltOutlinedIcon />
                            </IconButton> 
                            <IconButton aria-label="delete" onClick={handleClickOpen}>
                                <DeleteIcon />
                            </IconButton>
                                <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">
                                            {"Confirm delete"}
                                        </DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Please confirm VM deletion
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose}>Cancel</Button>
                                        <Button onClick={() => DeleteVM(vm.Name, vm.ID)} autoFocus>
                                                Confirm
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                            </CardActions> 
                            <CardActions>                                 
                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={() => GetNotes(vm.ID)}>
                                    View Notes
                                </button>
                                <div class="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Notes</h5>                                                
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                                <IconButton aria-label="Refresh" onClick={() => GetNotes(VMID)} >
                                                    <Refresh />
                                                </IconButton>
                                            </div>
                                            <div className="modal-body">
                                                    {Notes?.map((note) => (
                                                        <ListItem key={note.ID}>
                                                            <ListItemAvatar>
                                                                <Avatar alt={note.Title} />
                                                            </ListItemAvatar>
                                                            <ListItemText primary={note.Description} secondary={note.User} />                                                              
                                                            <ListItemIcon>
                                                                <IconButton aria-label="Delete" onClick={() => deleteNote(note.ID)} >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </ListItemIcon>                                            
                                                        </ListItem>
                                                    ))}
                                                    <input
                                                        type="text"
                                                        onChange={(e) => setNewNote(e.target.value)}
                                                        name="newNote"
                                                        width="100%"
                                                    />
                                                    <ListItemIcon>
                                                        <IconButton aria-label="Add" onClick={() => addNote()} >
                                                            <AddComment />
                                                        </IconButton>
                                                    </ListItemIcon>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardActions>
                        </Card>        
                    ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;