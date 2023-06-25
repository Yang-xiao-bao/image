import {
  Component,
  createMemo,
  createSignal,
  onMount,
  Show,
  Switch,
  Match,
} from "solid-js";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  Link,
  useHref,
  useNavigate,
} from "@solidjs/router";
import { Basic } from "./pages/Basic";
import { Grid, GridItem, List, ListItem } from "@hope-ui/solid";
import { CodeBlock } from "./components/CodeBlock";
import { Hist } from "./pages/Hist";
import basic from "./libs/show.ts?url";
import histCode from "./libs/hist.ts?url";
import gray from "./libs/gray.ts?url";
import imadjust from "./libs/adjust.ts?url";
import adjustLines from "./libs/adjustLines.ts?url";
import histEqCode from "./libs/histeq.ts?url";
import histMatchCode from "./libs/histMatch.ts?url";
import excatHistMatch from "./libs/exactHistMatch.ts?url";
import strechlimCode from "./libs/stretchlim.ts?url";
import statisticsCode from "./libs/statistics.ts?url";
import convolveCode from "./libs/convolve.ts?url";
import asyncConvolveCode from "./libs/asyncConvolve.ts?url";
import boxFilterCode from "./libs/box-filter.ts?url";
import separableKernelCode from "./libs/separableKernel.ts?url";
import { Gray } from "./pages/Gray";
import style from "./App.module.css";
import { Adjust } from "./pages/Adjust";
import { HistEq } from "./pages/HistEq";
import { StretchLim } from "./pages/Stretchlim";
import { AdjustLines } from "./pages/AdjustLines";
import { Statistics } from "./pages/Statistics";
import { HistSpecification } from "./pages/HistSpecification";
import { LocalHistProcessing } from "./pages/LocalHistProcessing";
import localHistProcessingCode from "./libs/localHist.ts?url";
import { ExcatHistMatch } from "./pages/ExactHistMatch";
import { TreeView } from "./components/TreeView";
import { Tabs } from "./components/Tabs";
import { BoxFilter } from "./pages/BoxFilter";
import { AsyncConvolve } from "./pages/AsyncConvolve";
import { SeparableConvolve } from "./pages/SeparableConvolve";
import { GaussianFilter } from './pages/GaussianFilter'
import { GaussianVsBox } from './pages/GaussianVsBox'
import { ShadowRemoval } from "./pages/ShadowRemoval";
import { Padding } from './pages/Padding'
import { Laplacian } from "./pages/Laplacian"
import { LaplacianSharpening } from "./pages/LaplacianSharpening"
import laplacianFilterCode from "./libs/laplacian.ts?url"
import arithmetical from "./libs/arithmetical.ts?url"
import gaussianFilterCode from "./libs/gaussian.ts?url"
import laplacianSharpeningCode from "./libs/laplacianSharpening.ts?url"
import { Sobel } from './pages/Sobel'
import sobelCode from './libs/sobel.ts?url'
import { UnsharpMasking } from './pages/UnsharpMasking'
import unsharpMaskingCode from './libs/unsharpMasking.ts?url'
import { Filters } from "./pages/Filters";
import { DFTBasic } from './pages/frequency-domain/DFTBasic'
import dftCode from './libs/dft.ts?url'
import dftSpectrumCode from './libs/dftSpectrum.ts?url'
import phaseAngleCode from './libs/phaseAngle.ts?url'
import { FFT } from './pages/frequency-domain/FFT'
import fftCode from './libs/fft.ts?url'
import { FFT1 } from './pages/frequency-domain/FFT1'
import FFT1Code from './pages/frequency-domain/FFT1.tsx?url'
import { FFT_IFFT } from "./pages/frequency-domain/FFT_IFFT";
import fftIfftCode from "./pages/frequency-domain/FFT_IFFT.tsx?url"

const App: Component = () => {
  const [tab, setTab] = createSignal("效果");
  return (
    <Grid gap="10px" h="100vh" templateColumns="300px 1fr">
      <GridItem>
        <Navigations />
      </GridItem>
      <GridItem>
        <Tabs
          class={style.tabs}
          tabs={["效果", "关键代码"]}
          selected={tab()}
          onChange={setTab}
        />
        <Switch fallback={<div>No Matched</div>}>
          <Match when={tab() === "效果"}>
            <Routes>
              <Route path="/basic" component={Basic} />
              <Route path="/hist" component={Hist} />
              <Route path="/gray" component={Gray} />
              <Route path="/adjust" component={Adjust} />
              <Route path="/adjust-lines" component={AdjustLines} />
              <Route path="/adjust-strechlim" component={StretchLim} />
              <Route path="/histeq" component={HistEq} />
              <Route path="/hist-specification" component={HistSpecification} />
              <Route
                path="/local-hist-processing"
                component={LocalHistProcessing}
              />
              <Route path="/excat-hist-match" component={ExcatHistMatch} />
              <Route path="/statistics" component={Statistics} />
              <Route path="/box-filter" component={BoxFilter} />
              <Route path="/async" component={AsyncConvolve} />
              <Route path="/separable" component={SeparableConvolve} />
              <Route path="/gaussian-filter" component={GaussianFilter} />
              <Route path="/gaussian-vs-box" component={GaussianVsBox} />
              <Route path="/shadow-removal" component={ShadowRemoval} />
              <Route path="/padding" component={Padding} />
              <Route path="/laplacian-filter" component={Laplacian} />
              <Route path="/laplacian-sharpening" component={LaplacianSharpening} />
              <Route path="/sobel" component={Sobel} />
              <Route path="/unsharp-masking" component={UnsharpMasking} />
              <Route path="/filters" component={Filters} />
              <Route path="/dft" component={DFTBasic} />
              <Route path="/fft" component={FFT} />
              <Route path="/fft-spectrum" component={FFT1} />
              <Route path="/fft-ifft" component={FFT_IFFT} />
              <Route path="*" element={<Navigate href="/basic" />} />
            </Routes>
          </Match>
          <Match when={tab() === "关键代码"}>
            <ShowCode />
          </Match>
        </Switch>
      </GridItem>
    </Grid>
  );
};

function Navigations() {
  const navigate = useNavigate();
  return (
    <TreeView<string>
      onLeafClick={(item) => {
        if (item.value === "") return;
        navigate(item.value);
      }}
      data={[
        { name: "图像的绘制", value: "/basic" },
        {
          name: "直方图",
          value: "",
          children: [
            { name: "直方图", value: "/hist" },
            { name: "统计量", value: "/statistics" },
          ],
        },
        {
          name: "灰度处理",
          value: "",
          children: [
            { name: "去色", value: "/gray" },
            { name: "调整(imadjust)", value: "/adjust" },
            { name: "分段调整", value: "/adjust-lines" },
            { name: "自动", value: "/adjust-strechlim" },
          ],
        },
        {
          name: "直方图处理",
          value: "",
          children: [
            { name: "直方图均衡(histeq)", value: "/histeq" },
            { name: "直方图匹配", value: "/hist-specification" },
            { name: "精确匹配", value: "/excat-hist-match" },
            { name: "局部直方图处理", value: "/local-hist-processing" },
          ],
        },
        {
          name: "空间滤波",
          value: "",
          children: [
            { name: "盒试滤波器", value: "/box-filter" },
            { name: "异步滤波器", value: "/async" },
            { name: "可分离滤波核", value: "/separable" },
            { name: "高斯滤波器", value: "/gaussian-filter" },
            { name: "高斯vs盒式", value: "/gaussian-vs-box" },
            { name: "阴影矫正", value: "/shadow-removal" },
            { name: "拉普拉斯滤波器核", value: "/laplacian-filter" },
            { name: "锐化(拉普拉斯)", value: "/laplacian-sharpening" },
            { name: "Sobel", value: "/sobel" },
            { name: "钝化掩码", value: "/unsharp-masking" },
            { name: "用低通生成高通", value: "/filters" }
          ],
        },
        {
          name: "频域滤波",
          value: "",
          children: [
            {
              name: "离散傅里叶变换",
              value: "/dft"
            },
            {
              name: "快速傅里叶变换",
              value: "/fft"
            },
            {
              name: "观察频谱",
              value: '/fft-spectrum'
            }, {
              name: "傅里叶变换和逆变换",
              value: '/fft-ifft'
            }
          ]
        }
      ]}
    />
  );
}

function ShowCode() {
  const code: Record<string, string | Array<{ name: string; url: string }>> = {
    "/basic": basic,
    "/hist": histCode,
    "/gray": gray,
    "/adjust": imadjust,
    "/adjust-lines": adjustLines,
    "/histeq": histEqCode,
    "/hist-specification": histMatchCode,
    "/excat-hist-match": excatHistMatch,
    "/adjust-strechlim": strechlimCode,
    "/local-hist-processing": localHistProcessingCode,
    "/statistics": statisticsCode,
    "/box-filter": [
      { name: "convolve.ts", url: convolveCode },
      { name: "boxFilter.ts", url: boxFilterCode },
    ],
    "/async": asyncConvolveCode,
    "/separable": separableKernelCode,
    "/gaussian-filter": [
      { name: "gaussian.ts", url: gaussianFilterCode },
      { name: "asyncConvolve.ts", url: asyncConvolveCode },
      { name: "separableKernel.ts", url: separableKernelCode },
    ],
    "/shadow-removal": [
      { name: "gaussian.ts", url: gaussianFilterCode },
      { name: "asyncConvolve.ts", url: asyncConvolveCode },
      { name: "arithmetical.ts", url: arithmetical },
    ],
    "/laplacian-filter": laplacianFilterCode,
    "/laplacian-sharpening": laplacianSharpeningCode,
    '/sobel': sobelCode,
    '/unsharp-masking': unsharpMaskingCode,
    '/dft': [
      { name: 'dft.ts', url: dftCode },
      { name: 'dftSpectrum.ts', url: dftSpectrumCode },
      { name: 'phaseAngle.ts', url: phaseAngleCode }
    ],
    '/fft': [
      { name: 'fft.ts', url: fftCode },
      { name: 'dftSpectrum.ts', url: dftSpectrumCode },
      { name: 'phaseAngle.ts', url: phaseAngleCode }
    ],
    '/fft-spectrum': [
      { name: 'FFT1.tsx', url: FFT1Code },
      { name: 'dftSpectrum.ts', url: dftSpectrumCode },
    ],
    '/fft-ifft': [
      { name: 'fft1.ts', url: fftCode },
      { name: "FFT_IFFT.tsx", url: fftIfftCode },
    ]
  };
  const location = useLocation();
  const codeBlock = createMemo(() => {
    const url = code[location.pathname.replace(/^\/image/, "")];
    if (typeof url === "string") {
      return <CodeBlock url={url} />;
    } else {
      return <CodeBlocks files={url} />;
    }
  });
  return codeBlock;
}
function CodeBlocks(props: { files: Array<{ name: string; url: string }> }) {
  const [tab, setTab] = createSignal(props.files[0]);
  return (
    <div>
      <Tabs
        class={style.tabs}
        tabs={props.files.map((f) => f.name)}
        selected={tab().name}
        onChange={(t) => setTab(props.files.find((f) => f.name === t)!)}
      />
      <CodeBlock url={tab().url} />
    </div>
  );
}

export default App;
