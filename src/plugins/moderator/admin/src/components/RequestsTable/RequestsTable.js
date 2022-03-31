import React from "react";

import { Box } from "@strapi/design-system/Box";
import { Typography } from "@strapi/design-system/Typography";
import { LinkButton } from "@strapi/design-system/LinkButton";
import { Button } from "@strapi/design-system/Button";
import Plus from "@strapi/icons/Plus";
import Eye from "@strapi/icons/Eye";
import Check from "@strapi/icons/Check";
import Close from "@strapi/icons/Close";
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

const TabContent = ({ collection, name }) => {
  return (
    <TabPanel>
      {/* TABLE */}
      <Table colCount={2} rowCount={collection.length}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">Title</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">User</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {collection && !_.isEmpty(collection) ? (
            collection.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <Typography textColor="neutral800">
                    {item.title || item.site.title}
                  </Typography>
                </Td>
                <Td>
                  {item.owner?.name ? (
                    <Typography textColor="neutral800">
                      {item.owner?.name}
                    </Typography>
                  ) : (
                    <Typography textColor="neutral400">Unknown</Typography>
                  )}
                </Td>
                <Td>
                  <Flex justifyContent="right" alignItems="right">
                    <LinkButton
                      to={`/content-manager/collectionType/api::${name}.${name}/${item.id}`}
                      style={{ marginRight: 12 }}
                      startIcon={<Eye />}
                    >
                      View
                    </LinkButton>
                    <Button
                      variant="success-light"
                      startIcon={<Check />}
                      style={{ marginRight: 12 }}
                    >
                      Complete
                    </Button>
                    <Button variant="danger-light" startIcon={<Close />}>
                      Delete
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))
          ) : (
            <Box padding={8} background="neutral0">
              <EmptyStateLayout
                icon={<Illo />}
                content={`You don't have any ${name}s yet...`}
              />
            </Box>
          )}
        </Tbody>
      </Table>

      {/* END TABLE */}
    </TabPanel>
  );
};

const RequestsTable = ({ requests }) => {
  return (
    <Box padding={8}>
      <TabGroup label="label" id="tabs">
        <Tabs>
          <Tab>
            <Typography variant="omega">Addition requests</Typography>
          </Tab>
          <Tab>
            <Typography variant="omega">Edit requests</Typography>
          </Tab>
        </Tabs>
        <TabPanels>
          <TabContent collection={requests.additions} name="addition-request" />
          <TabContent collection={requests.edits} name="edit-request" />
        </TabPanels>
      </TabGroup>
    </Box>
  );
};

export default RequestsTable;
