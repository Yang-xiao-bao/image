import { Component, createMemo } from 'solid-js';
import { Routes, Route, useLocation, Navigate, Link, useHref } from '@solidjs/router'
import { Basic } from './pages/Basic';
import { Grid, GridItem, List, ListItem, Tabs, Tab, TabList, TabPanel } from '@hope-ui/solid'
import { CodeBlock } from './components/CodeBlock';
import { Hist } from './pages/Hist';
import basic from './libs/show.ts.txt'
import histCode from './libs/hist.ts.txt'
import gray from './libs/gray.ts.txt'
import imadjust from './libs/adjust.ts.txt'
import histEqCode from './libs/histeq.ts.txt'
import strechlimCode from './libs/stretchlim.ts.txt'
import statisticsCode from './libs/statistics.ts.txt'
import { Gray } from './pages/Gray';
import style from './App.module.css'
import { Adjust } from './pages/Adjust';
import { HistEq } from './pages/HistEq'
import { StretchLim } from './pages/Stretchlim';
import { AdjustLines } from './pages/AdjustLines';
import { Statistics } from './pages/Statistics';
import { HistSpecification } from './pages/HistSpecification'

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
          <ListItem>
            <Link href="/statistics">
              均值、方差
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/gray">
              去色
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/adjust">
              调整(imadjust)
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/adjust-lines">
              分段调整
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/adjust-strechlim">
              自动拉伸(imadjust)
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/histeq">
              直方图均衡(histeq)
            </Link>
          </ListItem>
          <ListItem>
            <Link href="/hist-specification">
              直方图匹配
            </Link>
          </ListItem>
        </List>
      </GridItem>
      <GridItem>
        <Tabs class={style.tabs}>
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
              <Route path="/gray" component={Gray} />
              <Route path="/adjust" component={Adjust} />
              <Route path="/adjust-lines" component={AdjustLines} />
              <Route path="/adjust-strechlim" component={StretchLim} />
              <Route path="/histeq" component={HistEq} />
              <Route path="/hist-specification" component={HistSpecification} />
              <Route path="/statistics" component={Statistics} />
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
    '/hist': histCode,
    '/gray': gray,
    '/adjust': imadjust,
    '/histeq': histEqCode,
    '/adjust-strechlim': strechlimCode,
    '/hist-specification': '',
    '/statistics': statisticsCode
  }
  const location = useLocation()

  return <>
    <CodeBlock url={code[location.pathname.replace(/^\/image/, '')]} />
  </>
}

export default App;
