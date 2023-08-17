import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { Typography } from "@mui/material";


export default function SideMenu() {


    return (
        <Box>
            <List>
                <ListItem>
                    <Typography>Hello there</Typography>
                </ListItem>
            </List>
            <Divider />
        </Box>
    );
}