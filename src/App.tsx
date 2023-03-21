import type { Component } from 'solid-js';
import { Routes, Route, useLocation, Navigate } from '@solidjs/router'
import { Basic } from './pages/Basic';
import { Grid, GridItem, List, ListItem, Tabs, Tab, TabList, TabPanel } from '@hope-ui/solid'
import basic from './libs/show.txt'
import { CodeBlock } from './components/CodeBlock';


const App: Component = () => {
  return (
    <Grid h="100vh" templateColumns="300px 1fr" >
      <GridItem>
        <List>
          <ListItem>
            图像的绘制
          </ListItem>
        </List>
      </GridItem>
      <GridItem>
        <Tabs>
          <TabList>
            <Tab>效果</Tab>
            <Tab>关键代码</Tab>
          </TabList>
          <TabPanel>
            <Routes>
              <Route path="/basic"
                component={Basic}
              />
              <Route path="*" element={<Navigate href="/basic" />}/>
            </Routes>
          </TabPanel>
          <TabPanel>
            <ShowCode />
          </TabPanel>
        </Tabs>
      </GridItem>
    </Grid>
  );
};

function ShowCode() {
  const code: Record<string, string> = {
    '/basic': basic
  }
  const location = useLocation()
  return <CodeBlock url={code[location.pathname]} />
}

export default App;
