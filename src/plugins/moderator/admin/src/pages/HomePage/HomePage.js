import React, { memo, useState, useEffect, useRef } from "react";

import {
  fetchAllRequests,
  rejectRequest,
  approveRequest,
} from "../../utils/api";

import RequestsTable from "../../components/RequestsTable";

import { LoadingIndicatorPage, ConfirmDialog } from "@strapi/helper-plugin";
import Check from "@strapi/icons/Check";

import { Box } from "@strapi/design-system/Box";
import { BaseHeaderLayout } from "@strapi/design-system/Layout";

const HomePage = () => {
  const requests = useRef({});

  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmRejectDialogOpen, setIsConfirmRejectDialogOpen] =
    useState(false);
  const [rejectItem, setRejectItem] = useState({});
  const [isConfirmApproveDialogOpen, setIsConfirmApproveDialogOpen] =
    useState(false);
  const [approveItem, setApproveItem] = useState({});
  const [initialSelectedTabIndex, setInitialSelectedTabIndex] = useState(0);

  const confirmReject = (collection, id) => {
    setIsConfirmRejectDialogOpen(true);
    setRejectItem({
      collection,
      id,
    });
  };

  const confirmApprove = (collection, id) => {
    setIsConfirmApproveDialogOpen(true);
    setApproveItem({
      collection,
      id,
    });
  };

  const approve = async () => {
    setIsConfirmApproveDialogOpen(false);
    setIsLoading(true);
    await approveRequest(approveItem.collection, approveItem.id);
    requests.current = await fetchAllRequests();
    if (approveItem.collection === "edit-request") {
      setInitialSelectedTabIndex(1);
    } else if (approveItem.collection === "comment") {
      setInitialSelectedTabIndex(2);
    }
    setIsLoading(false);
  };

  const reject = async () => {
    setIsConfirmRejectDialogOpen(false);
    setIsLoading(true);
    await rejectRequest(rejectItem.collection, rejectItem.id);
    requests.current = await fetchAllRequests();
    if (rejectItem.collection === "edit-request") {
      setInitialSelectedTabIndex(1);
    } else if (approveItem.collection === "comment") {
      setInitialSelectedTabIndex(2);
    }
    setIsLoading(false);
  };

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

      <RequestsTable
        requests={requests.current}
        rejectRequest={confirmReject}
        approveRequest={confirmApprove}
        initialSelectedTabIndex={initialSelectedTabIndex}
      />
      <ConfirmDialog
        bodyText={{
          id: "reject-confirm",
          defaultMessage: "This will reject this request",
        }}
        iconRightButton={<Check />}
        isConfirmButtonLoading={false}
        isOpen={isConfirmRejectDialogOpen}
        onToggleDialog={() => {
          setRejectItem({});
          setIsConfirmRejectDialogOpen(!isConfirmRejectDialogOpen);
        }}
        onConfirm={reject}
        variantRightButton="success-light"
      />
      <ConfirmDialog
        bodyText={{
          id: "approve-confirm",
          defaultMessage: "This will approve this request",
        }}
        iconRightButton={<Check />}
        isConfirmButtonLoading={false}
        isOpen={isConfirmApproveDialogOpen}
        onToggleDialog={() => {
          setApproveItem({});
          setIsConfirmApproveDialogOpen(!isConfirmApproveDialogOpen);
        }}
        onConfirm={approve}
        variantRightButton="success-light"
      />
    </>
  );
};

export default memo(HomePage);
