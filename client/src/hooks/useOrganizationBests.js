import { useState } from "react";
import * as stakeholderService from "../services/stakeholder-best-service";

export const useOrganizationBests = () => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: false,
  });

  const search = async ({
    name,
    latitude,
    longitude,
    radius,
    categoryIds,
    isInactive,
    verificationStatusId,
  }) => {
    if (!latitude || !longitude) {
      setState({ data: null, loading: false, error: true });
      const msg =
        "Call to search function missing latitude and/or longitude parameters";
      console.error(msg);
      return Promise.reject(msg);
    }
    //if (!categoryIds || categoryIds.length === 0) return;
    try {
      setState({ data: null, loading: true, error: false });
      const stakeholders = await stakeholderService.search({
        name,
        categoryIds,
        latitude,
        longitude,
        distance: radius,
        isInactive,
        verificationStatusId,
      });
      setState({ data: stakeholders, loading: false, error: false });
      return stakeholders;
    } catch (err) {
      setState({ data: null, loading: false, error: true });
      console.error(err);
      return Promise.reject(err);
    }
  };

  return { ...state, search };
};
