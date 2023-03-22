import { Component, createMemo } from 'solid-js';
import { Routes, Route, useLocation, Navigate, Link, useHref } from '@solidjs/router'
import { Basic } from './pages/Basic';
import { Grid, GridItem, List, ListItem, Tabs, Tab, TabList, TabPanel } from '@hope-ui/solid'
import { CodeBlock } from './components/CodeBlock';
import { Hist } from './pages/Hist';
import basic from './libs/show.ts.txt'
import histCode from './libs/hist.ts.txt'


const App: Component = () => {
  return (
    <Grid h="100vh" templateColumns="300px 1fr" >
      <GridItem>
        <List>
          <ListItem>
            <Link href="/basic">
              图像的绘制
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/hist">
              直方图
            </Link>
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
              <Route path="/hist" component={Hist} />
              <Route path="*" element={<Navigate href="/basic" />} />
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
    '/basic': basic,
    '/hist': histCode
  }
  const location = useLocation()

  return <>
    <CodeBlock url={code[location.pathname.replace(/^\/image/, '')]} />
  </>
}

export default App;
