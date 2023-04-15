import { children, Component, createMemo } from 'solid-js';
import { Routes, Route, useLocation, Navigate, Link, useHref, useNavigate } from '@solidjs/router'
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
import { LocalHistProcessing } from './pages/LocalHistProcessing';
import localHistProcessingCode from './libs/localHist.ts.txt'
import { ExcatHistMatch } from './pages/ExactHistMatch';
import { TreeView } from './components/TreeView';

const App: Component = () => {
  return (
    <Grid gap="10px" h="100vh" templateColumns="300px 1fr" >
      <GridItem>
        <Navigations />
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
              <Route path="/local-hist-processing" component={LocalHistProcessing} />
              <Route path="/excat-hist-match" component={ExcatHistMatch} />
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

function Navigations() {
  const navigate = useNavigate()
  return <TreeView<string>
    onLeafClick={(item) => {
      if (item.value === "") return
      navigate(item.value)
    }}
    data={[
      { name: "图像的绘制", value: "/basic" },
      {
        name: "直方图", value: "",
        children: [
          { name: "直方图", value: "/hist" },
          { name: "统计量", value: "/statistics"}
        ]
      },
      {
        name: "灰度处理", value: "",
        children: [
          { name: "去色", value: "/gray" },
          { name: "调整(imadjust)", value: "/adjust" },
          { name: "分段调整", value: "/adjust-lines" },
          { name: "自动", value: "/adjust-strechlim" },
        ]
      },
      {

        name: "直方图处理", value: "",
        children: [
          { name: "直方图均衡(histeq)", value: "/histeq" },
          { name: "直方图匹配", value: "/hist-specification" },
          { name: "精确匹配", value: "/excat-hist-match" },
          { name: "局部直方图处理", value: "/local-hist-processing" },
        ]
      }

    ]}
  />
}

function ShowCode() {
  const code: Record<string, string> = {
    '/basic': basic,
    '/hist': histCode,
    '/gray': gray,
    '/adjust': imadjust,
    '/histeq': histEqCode,
    '/adjust-strechlim': strechlimCode,
    '/hist-specification': '',
    '/local-hist-processing': localHistProcessingCode,
    '/statistics': statisticsCode
  }
  const location = useLocation()

  return <>
    <CodeBlock url={code[location.pathname.replace(/^\/image/, '')]} />
  </>
}

export default App;
