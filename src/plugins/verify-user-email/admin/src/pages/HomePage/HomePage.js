import React, { memo, useState, useEffect, useRef } from "react";
import { LoadingIndicatorPage, ConfirmDialog } from "@strapi/helper-plugin";
import Check from "@strapi/icons/Check";
import { Box } from "@strapi/design-system/Box";
import { BaseHeaderLayout } from "@strapi/design-system/Layout";

import RequestsTable from "../../components/RequestsTable";
import pluginId from "../../pluginId";
import { fetchAllUsers, verifyUserEmail } from "../../utils/api";

const HomePage = () => {
  const requests = useRef({});

  const [isLoading, setIsLoading] = useState(true);
  const [userToVerify, setUserToVerify] = useState();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const confirmVerify = (user) => {
    setIsConfirmDialogOpen(true);
    setUserToVerify(user);
  };

  const verifyUser = async () => {
    setIsConfirmDialogOpen(false);
    if (userToVerify) {
      setIsLoading(true);
      await verifyUserEmail(userToVerify);
      requests.current = await fetchAllUsers();
      setIsLoading(false);
    }
  };

  useEffect(async () => {
    requests.current = await fetchAllUsers();
    setIsLoading(false);
  }, []);

  return (
    <>
      <Box background="neutral100">
        <BaseHeaderLayout
          title="Verify user email"
          subtitle="Should only be used for test accounts"
          as="h2"
        />
      </Box>
      <RequestsTable users={requests.current} verifyUser={confirmVerify} />
      <ConfirmDialog
        bodyText={{
          id: "verify-confirm",
          defaultMessage: "Set this users email as verified",
        }}
        iconRightButton={<Check />}
        isConfirmButtonLoading={false}
        isOpen={isConfirmDialogOpen}
        onToggleDialog={() => {
          setUserToVerify({});
          setIsConfirmDialogOpen(!isConfirmDialogOpen);
        }}
        onConfirm={verifyUser}
        variantRightButton="success-light"
      />
    </>
  );
};

export default memo(HomePage);
