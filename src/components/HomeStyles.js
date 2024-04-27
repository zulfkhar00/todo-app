import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    // backgroundColor: theme.palatte.background.paper,
    // padding: theme.spacing(20, 0, 6)
    marginTop: "100px",
  },
  buttonBox: {
    // backgroundColor: theme.palatte.background.paper,
    marginTop: "80px",
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main, // Match the background color of the navigation bar
    color: theme.palette.primary.contrastText,
    textAlign: "center",
    zIndex: theme.zIndex.appBar + 1, // Ensure footer is above other elements
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  footerLink: {
    textDecoration: "none",
    color: theme.palette.primary.contrastText,
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export default useStyles;
