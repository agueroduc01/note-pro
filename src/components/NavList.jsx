import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  LightbulbOutlined as Lightbulb,
  ArchiveOutlined as Archive,
  DeleteOutlineOutlined as Delete,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const NavList = () => {
  const navList = [
    { id: 1, name: "Notes", icon: <Lightbulb />, route: "/" },
    { id: 2, name: "Archives", icon: <Archive />, route: "/archive" },
    { id: 3, name: "Trash", icon: <Delete />, route: "/delete" },
  ];

  let colorCurrentRoute = new URL(window.location.href).pathname;
  useEffect(() => {
    return () => {
      // console.log(colorCurrentRoute);
    };
  }, [colorCurrentRoute]);

  return (
    <List>
      {navList.map((list) => (
        <ListItem
          button
          key={list.id}
          style={{
            padding: "0 8px",
            backgroundColor:
              colorCurrentRoute === list.route ? "#b7b7b7" : "inherit",
          }}
        >
          <Link
            to={`${list.route}`}
            style={{
              textDecoration: "none",
              display: "flex",
              color: "inherit",
              width: "inherit",
              padding: "8px 0",
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
