import React, { useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CustomTabs from "components/CustomTabs/CustomTabs";
import { Info, ArrowRightAlt } from "@material-ui/icons";

// @material-ui/icons

// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";

import styles from "assets/jss/material-kit-react/views/landingPage.js";

// Sections for this page
import { useParams } from "react-router";
import { queryCommodity } from "api/ContractApi.js";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

function getTime(timestamp) {
  let date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

export default function LandingPage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const data = useParams();
  const [queryResult, setQueryResult] = React.useState({ success: false });

  useEffect(() => {
    if (data.id) {
      queryCommodity(data.id).then((res) => {
        setQueryResult(res);
      });
    }
  });

  return (
    <div>
      <Header
        color="transparent"
        routes={dashboardRoutes}
        brand="QNQ Trace Source System"
        // rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white",
        }}
        {...rest}
      />
      <Parallax filter image={require("assets/img/landing-bg.jpg").default}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <h1 className={classes.title}>
                {queryResult.success ? "queried" : "querying"} {data.id}
              </h1>
              <h4>Commodity Infomations with id </h4>
              <br />
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        {/* <div className={classes.container}> */}
        <CustomTabs
          headerColor="primary"
          tabs={[
            {
              tabName: "Profile",
              tabIcon: Info,
              tabContent: (
                <div>
                  {queryResult.success ? (
                    <div>
                      <h1>{queryResult.name}</h1>
                      <h5>
                        Produced at {getTime(parseInt(queryResult.produceTime))}
                      </h5>
                      <h2>{queryResult.description}</h2>
                    </div>
                  ) : (
                    <h1>Querying</h1>
                  )}
                </div>
              ),
            },
            {
              tabName: "Trace",
              tabIcon: ArrowRightAlt,
              tabContent: (
                <div>
                  {queryResult.success ? (
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Loc</TableCell>
                            <TableCell>Event</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {queryResult.deliverChain.map((row) => (
                            <TableRow
                              key={row.timestamp}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {getTime(row.timestamp)}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {row.location}
                              </TableCell>
                              <TableCell>{row.event}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <h1>Querying</h1>
                  )}
                </div>
              ),
            },
          ]}
        />
        {/* </div> */}
      </div>
      <Footer />
    </div>
  );
}
