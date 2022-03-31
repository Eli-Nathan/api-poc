import React, { memo, useState, useEffect, useRef } from "react";

import { fetchAllRequests } from "../../utils/api";

import RequestsTable from "../../components/RequestsTable";

import { LoadingIndicatorPage } from "@strapi/helper-plugin";

import { Box } from "@strapi/design-system/Box";
import { BaseHeaderLayout } from "@strapi/design-system/Layout";

const HomePage = () => {
  const requests = useRef({});

  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    requests.current = await fetchAllRequests();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  return (
    <>
      <Box background="neutral100">
        <BaseHeaderLayout
          title="Moderator"
          subtitle="Moderate addition and edit requests"
          as="h2"
        />
      </Box>

      <RequestsTable requests={requests.current} />
    </>
  );
};

export default memo(HomePage);
