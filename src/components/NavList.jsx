import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  LightbulbOutlined as Lightbulb,
  ArchiveOutlined as Archive,
  DeleteOutlineOutlined as Delete,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
// import { useState } from "react";

const NavList = () => {
  const navList = [
    { id: 1, name: "Notes", icon: <Lightbulb />, route: "/" },
    { id: 2, name: "Archives", icon: <Archive />, route: "/archive" },
    { id: 3, name: "Trash", icon: <Delete />, route: "/delete" },
  ];
  // const [colorCurrentRoute, setColorCurrentRoute] = useState(
  //   new URL(window.location.href).pathname
  // );

  // console.log(colorCurrentRoute === navList[1].route);

  return (
    <List>
      {navList.map((list) => (
        <ListItem button key={list.id}>
          {/* {setColorCurrentRoute(list.route)} && */}
          <Link
            to={`${list.route}`}
            style={{
              textDecoration: "none",
              display: "flex",
              //   color: colorCurrentRoute === list.route ? "#fff" : "inherit",
              //   backgroundColor:
              //     colorCurrentRoute === list.route ? "#333" : "inherit",
              color: "inherit",
              width: "inherit",
            }}
          >
            <ListItemIcon style={{ alignItems: "center" }}>
              {list.icon}
            </ListItemIcon>
            <ListItemText primary={list.name} />
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export default NavList;
