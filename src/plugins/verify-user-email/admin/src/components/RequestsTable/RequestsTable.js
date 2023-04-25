import React from "react";

import { Box } from "@strapi/design-system/Box";
import { Typography } from "@strapi/design-system/Typography";
import { LinkButton } from "@strapi/design-system/LinkButton";
import { Button } from "@strapi/design-system/Button";
import Plus from "@strapi/icons/Plus";
import Eye from "@strapi/icons/Eye";
import Check from "@strapi/icons/Check";
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout";
import { Flex } from "@strapi/design-system/Flex";
import { Table, Thead, Tbody, Tr, Td, Th } from "@strapi/design-system/Table";
import {
  Tabs,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
} from "@strapi/design-system/Tabs";

const RequestsTable = ({ users, verifyUser }) => {
  return (
    <Box padding={8}>
      {/* TABLE */}
      <Table colCount={2} rowCount={users.length}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">Name</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Email</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">UUID</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {users && !_.isEmpty(users) ? (
            users.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <Typography textColor="neutral800">{item.name}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{item.email}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{item.user_id}</Typography>
                </Td>
                <Td>
                  <Flex justifyContent="right" alignItems="right">
                    <LinkButton
                      to={`/content-manager/collectionType/api::auth-user.auth-user/${item.id}`}
                      style={{ marginRight: 12 }}
                      startIcon={<Eye />}
                    >
                      View
                    </LinkButton>
                    <Button
                      onClick={() => verifyUser(item.id)}
                      variant="success-light"
                      startIcon={<Check />}
                      style={{ marginRight: 12 }}
                    >
                      Verify
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))
          ) : (
            <Box padding={8} background="neutral0">
              <EmptyStateLayout content={`No users to show...`} />
            </Box>
          )}
        </Tbody>
      </Table>

      {/* END TABLE */}
    </Box>
  );
};

export default RequestsTable;
