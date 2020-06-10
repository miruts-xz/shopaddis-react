import {createMuiTheme, responsiveFontSizes} from "@material-ui/core";
import brown from "@material-ui/core/colors/brown";
import green from "@material-ui/core/colors/green"
import orange from "@material-ui/core/colors/orange"
import yellow from "@material-ui/core/colors/yellow";
import {purple} from "@material-ui/core/colors";

let theme = createMuiTheme({
    palette: {
        primary: purple,
        secondary: orange,
    }
});
theme = responsiveFontSizes(theme);
export default theme;