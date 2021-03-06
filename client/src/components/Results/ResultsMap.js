import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactMapGL, { NavigationControl } from "react-map-gl";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { MAPBOX_STYLE } from "constants/map";
import { DEFAULT_CATEGORIES } from "constants/stakeholder";
import { isMobile } from "helpers";

import StakeholderPreview from "components/Stakeholder/StakeholderPreview";
import StakeholderDetails from "components/Stakeholder/StakeholderDetails";
import Marker from "components/Marker";

const styles = {
  navigationControl: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 10,
    zIndex: 5,
  },
};

const useStyles = makeStyles((theme) => ({
  map: {
    textAlign: "center",
    fontSize: "12px",
    [theme.breakpoints.down("sm")]: {
      order: 0,
    },
  },
  preview: {
    margin: "0 1em",
  },
}));

function Map({
  stakeholders,
  categoryIds,
  doSelectStakeholder,
  selectedStakeholder,
  isWindowWide,
  viewport,
  setViewport,
  setToast,
}) {
  const classes = useStyles();
  const categoryIdsOrDefault = categoryIds.length
    ? categoryIds
    : DEFAULT_CATEGORIES;

  const [showDetails, setShowDetails] = useState(false);

  const unselectStakeholder = () => {
    setShowDetails(false);
    doSelectStakeholder(null);
  };

  if (showDetails && isMobile && selectedStakeholder) {
    return (
      <StakeholderDetails
        doSelectStakeholder={unselectStakeholder}
        selectedStakeholder={selectedStakeholder}
        setToast={setToast}
      />
    );
  }

  return (
    <>
      <Grid
        item
        xs={12}
        md={8}
        className={classes.map}
        style={{
          height:
            isWindowWide || isMobile
              ? isMobile && !!selectedStakeholder
                ? `calc(100% - 120px)`
                : "100%"
              : "50%",
        }}
      >
        <ReactMapGL
          {...viewport}
          /* dragPan={isWindowWide && isMobile ? false : true} */
          // touchAction="pan-y pinch-zoom"
          width="100%"
          height="100%"
          onViewportChange={(newViewport) => setViewport(newViewport)}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle={MAPBOX_STYLE}
          onClick={() => doSelectStakeholder(null)}
        >
          <div style={styles.navigationControl}>
            <NavigationControl showCompass={false} />
          </div>
          {stakeholders &&
            stakeholders
              .filter(
                (sh) =>
                  sh.latitude &&
                  sh.longitude &&
                  !(sh.inactive || sh.inactiveTemporary)
              )
              .map((stakeholder) => {
                const categories = stakeholder.categories.filter(({ id }) => {
                  return categoryIdsOrDefault.includes(id);
                });

                return (
                  <Marker
                    onClick={() => doSelectStakeholder(stakeholder)}
                    key={stakeholder.id}
                    selectedStakeholder={selectedStakeholder}
                    stakeholder={{
                      ...stakeholder,
                      categories,
                    }}
                  />
                );
              })}
        </ReactMapGL>
      </Grid>
      {!!selectedStakeholder && isMobile && (
        <Grid
          item
          xs={12}
          md={8}
          className={classes.preview}
          onClick={() => setShowDetails(true)}
        >
          <StakeholderPreview
            doSelectStakeholder={doSelectStakeholder}
            stakeholder={selectedStakeholder}
          />
        </Grid>
      )}
    </>
  );
}

Map.propTypes = {
  stakeholders: PropTypes.array,
  categoryIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedLatitude: PropTypes.number.isRequired,
  selectedLongitude: PropTypes.number.isRequired,
};

export default Map;
