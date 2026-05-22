import "./styles.css";

const app = document.querySelector("#app");
const assetBase = import.meta.env.BASE_URL;

app.innerHTML = `
  <div class="ambient-grid" aria-hidden="true"></div>
  <div class="grain" aria-hidden="true"></div>

  <header class="topbar site-shell">
    <a class="brand" href="#top" aria-label="返回顶部">
      <span class="brand-mark">HC</span>
      <span>
        <strong>Hyper-Compression 科普图</strong>
        <small>从中国高铁理解一条线如何压缩模型权重</small>
      </span>
    </a>
    <nav class="nav-links" aria-label="页面导航">
      <a href="#railway">高铁类比</a>
      <a href="#winding">无理缠绕</a>
      <a href="#compress">压缩流程</a>
      <a href="#quantization">量化关系</a>
    </nav>
  </header>

  <main id="top">
    <section class="hero site-shell">
      <div class="hero-copy">
        <p class="eyebrow">Hyperfunction as an implicit codebook</p>
        <h1>一条高铁线，如何压缩权重空间</h1>
        <p class="hero-lead">
          小明想去顺德找朋友玩。地图告诉他：顺德大约在 <code>22.8364°N, 113.2526°E</code>，
          这是一组完整经纬度。但在这个故事里，他能买到的高铁票只到附近的佛山，
          于是他先坐到佛山，再打车去顺德。也就是说，真实目的地的二维向量坐标
          <code>(22.8364°N, 113.2526°E)</code> 可以先被最近的高铁站近似替代。
        </p>
        <p class="hero-lead hero-lead-secondary">
          这就引出超压缩的直觉：想象全国每个地点原本都要存经纬度。超压缩做的事，是先铺一条可以覆盖空间的“数学高铁线”，
          然后不再存每个地点的完整坐标，只存它在这条线上的站号 <code>θ</code>。模型权重也是一样：
          一个权重块原本是高维向量，现在被替换成 hyperfunction 上最近的一个点。
        </p>
        <div class="hero-thesis">
          <span>精髓</span>
          <strong>用一个可计算函数生成巨大的隐式 codebook；每个权重块只保存索引，而不是保存整段权重。</strong>
        </div>
      </div>

      <div class="hero-card" aria-label="超压缩核心类比">
        <svg class="hero-line" viewBox="0 0 620 440" role="img" aria-label="一条线在二维空间中缠绕覆盖点云">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#39c8e8" />
              <stop offset="42%" stop-color="#36d99d" />
              <stop offset="100%" stop-color="#e5b862" />
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect x="34" y="34" width="552" height="372" rx="34" />
          <path class="space-grid" d="M118 34v372M202 34v372M286 34v372M370 34v372M454 34v372M538 34v372M34 96h552M34 158h552M34 220h552M34 282h552M34 344h552" />
          <g class="weight-dots">
            <circle cx="118" cy="308" r="8" />
            <circle cx="188" cy="126" r="6" />
            <circle cx="246" cy="248" r="7" />
            <circle cx="320" cy="172" r="8" />
            <circle cx="388" cy="322" r="6" />
            <circle cx="456" cy="116" r="7" />
            <circle cx="512" cy="238" r="8" />
          </g>
          <path id="heroWindingPath" class="winding-path" d="M72 352 C140 82 228 430 302 96 S456 378 548 126 C442 330 318 42 174 350 C266 150 418 98 548 302" />
          <g class="theta-tag">
            <rect x="364" y="250" width="142" height="48" rx="24" />
            <text x="435" y="280" text-anchor="middle">存 θ，不存向量</text>
          </g>
        </svg>
      </div>
    </section>

    <section id="railway" class="section site-shell">
      <div class="section-heading wide-heading">
        <p class="eyebrow">01 / Railway analogy</p>
        <h2>地点为什么可以只存“站号”？</h2>
        <p>
          比如“城市 A”“城市 B”“某个没有高铁的小镇”，都可以看成二维坐标 <code>(lon, lat)</code>。
          如果我们要精确保存全国所有地点，就要为每个地点存两个连续数。HC 的直觉是：能不能先造一条路线，
          让路线上的站点尽量接近这些地点，然后每个地点只存“它靠近哪条线、哪一站”？
        </p>
      </div>

      <div class="map-panel">
        <div class="map-copy">
          <p class="panel-kicker">公开中国地图作为直觉入口</p>
          <h3>在真实中国地图上，一条线把很多城市串起来</h3>
          <p>
            真实高铁线不会经过全国每一个点，所以现实里“离高铁站近”的地方可以用最近站代替，
            “离站远”的地方误差就大。这正好对应有限 bit 的 HC：<code>θ</code> 只能取有限个值，
            也就是一条线上只有有限个候选站点。
          </p>
          <p>
            右侧只保留一个轻动画：列车沿着一条示意线路前进。它表达的是同一件事：
            一旦路线由函数确定，存储一个地点不必存完整坐标，只要存它沿路线走到哪里。
          </p>
          <p>
            这里要抓住有限 <code>θ</code> 的含义：站点数量有限，不代表所有地方都真的有站。
            如果目的地没有通高铁，我们就去离它最近的高铁站；HC 里也是把原向量替换成函数轨迹上最近的候选点。
          </p>
        </div>

        <figure class="rail-map">
          <div class="map-stage">
            <div id="china-map-root" class="map-loading">地图加载中...</div>
          </div>
          <figcaption>
            地图数据：阿里云 DataV GeoAtlas 公开中国省级边界 GeoJSON，本地缓存绘制。这里叠加的高铁动画是讲解示意。
          </figcaption>
        </figure>
      </div>

      <div class="story-grid">
        <article class="story-card">
          <span>地点坐标</span>
          <h3>原始存储</h3>
          <p>每个地点都存 <code>(lon, lat)</code>。对应到模型里，就是每个权重块都存一个高维向量 <code>w_g</code>。</p>
        </article>
        <article class="story-card">
          <span>有限站点</span>
          <h3>有限 bit 的近似</h3>
          <p><code>B</code> bit 只能表示 <code>2^B</code> 个站点。没有通高铁的地方，不直接存坐标，而是选择最近站；误差就是到最近站的距离。</p>
        </article>
        <article class="story-card">
          <span>多条线路</span>
          <h3>多个 hyperfunction</h3>
          <p>京沪线、京广线、沪昆线像不同 codebook。HC 中也可以有多条 <code>h_m</code>，存线路号 <code>m</code> 和站号 <code>θ</code>。</p>
        </article>
      </div>

      <div class="theta-explain">
        <div>
          <span>理想情况：θ 可以无限细</span>
          <h3>一条数学高铁线可以铺得越来越密</h3>
          <p>
            如果 <code>θ</code> 能取无限多值，就像一条轨道可以继续加站、继续缠绕，最终在地图上变得非常密。
            这时每个地点都可以说成“这条线上的第 <code>n</code> 站附近”，存储从二维坐标变成一个站号。
          </p>
        </div>
        <div>
          <span>真实压缩：θ 只有有限 bit</span>
          <h3>只能从有限站点里找最近的一个</h3>
          <p>
            真正压缩时，<code>B</code> bit 只能给出 <code>2^B</code> 个可选站点。站点越多，线越密，误差越小；
            站点越少，压缩越狠，但“最近站替代”的误差会变大。
          </p>
        </div>
      </div>
    </section>

    <section class="split-section site-shell">
      <div class="section-heading">
        <p class="eyebrow">02 / From rail to function</p>
        <h2>把高铁线路换成数学线路：<code>h(θ)</code></h2>
        <p>
          真实高铁是一条地理曲线；HC 的 hyperfunction 是一条在权重空间里走的数学曲线。
          给它一个 <code>θ</code>，函数就输出一个向量。于是 <code>θ</code> 像站号或里程牌，
          <code>h(θ)</code> 像这个站点对应的坐标。
        </p>
      </div>

      <div class="equation-panel">
        <div class="equation-row">
          <span>生活类比</span>
          <strong>站号 <code>n</code> → 高铁线 → 经纬度</strong>
        </div>
        <div class="equation-row">
          <span>HC 表达</span>
          <strong><code>θ</code> → <code>h(θ)</code> → 权重向量</strong>
        </div>
        <p>
          压缩的关键不在于把函数训练得很大，而在于这个函数本身能用很少参数定义，却能生成非常多候选向量。
          它像一张“隐式 codebook”：codebook 不显式存成一张表，而是用公式随用随算。
        </p>
      </div>
    </section>

    <section id="winding" class="section dark-band">
      <div class="site-shell theory-layout">
        <div class="section-heading invert">
          <p class="eyebrow">03 / Irrational winding</p>
          <h2>一根线为什么能铺满空间？</h2>
          <p>
            论文前面的二维例子可以这样理解：一条线每次碰到边界就从另一侧绕回来；
            因为横向和纵向速度含有不同的无理比例，它不会简单重复同一条轨迹。
            时间足够长，轨迹会越来越密，像一团实心毛线球填满高维空间。
          </p>
        </div>

        <div class="winding-demo" aria-label="无理数缠绕示意">
          <svg viewBox="0 0 560 560" role="img" aria-label="无理数轨迹在单位方块中逐渐变密">
            <defs>
              <linearGradient id="windingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#39c8e8" />
                <stop offset="52%" stop-color="#36d99d" />
                <stop offset="100%" stop-color="#e5b862" />
              </linearGradient>
            </defs>
            <rect class="unit-box" x="54" y="54" width="452" height="452" rx="20" />
            <path class="unit-grid" d="M144 54v452M234 54v452M324 54v452M414 54v452M54 144h452M54 234h452M54 324h452M54 414h452" />
            <path class="dense-line" d="M73 472 L183 92 L292 450 L402 74 L488 342 L108 184 L464 498 L228 62 L86 360 L506 222 L154 506 L354 64 L496 438 L68 126 L418 506 L506 118 L118 434 L308 58 L486 270 L92 260 L280 504 L506 180 L184 72 L64 404 L438 64 L500 388 L142 98 L72 238 L346 506 L506 300 L232 498 L64 164 L476 86" />
            <circle class="moving-point" r="8">
              <animateMotion dur="10s" repeatCount="indefinite" path="M73 472 L183 92 L292 450 L402 74 L488 342 L108 184 L464 498 L228 62 L86 360 L506 222 L154 506 L354 64 L496 438 L68 126 L418 506 L506 118 L118 434 L308 58 L486 270 L92 260 L280 504 L506 180 L184 72 L64 404 L438 64 L500 388 L142 98 L72 238 L346 506 L506 300 L232 498 L64 164 L476 86" />
            </circle>
          </svg>
          <div class="formula-card">
            <span>论文中的二维形式</span>
            <code>x = τ(θ / (π + 1))</code>
            <code>y = τ(θ / (π + 2))</code>
            <code>τ(z) = z - floor(z)</code>
          </div>
        </div>
      </div>
    </section>

    <section id="compress" class="section site-shell">
      <div class="section-heading wide-heading">
        <p class="eyebrow">04 / Compression mechanism</p>
        <h2>真正压缩时，发生了什么？</h2>
        <p>
          把“地点”换成“权重块”后，流程非常直接：先把模型权重切成小块，每块是一个向量；
          再用 hyperfunction 生成大量候选向量；最后给每个权重块找最近的候选点，只保存这个候选点的 <code>θ</code>。
        </p>
      </div>

      <div class="pipeline">
        <article data-index="01">
          <span>1</span>
          <h3>切块</h3>
          <p>把权重矩阵分成很多组 <code>w_g</code>，每组看成 <code>K</code> 维空间里的一个点。</p>
        </article>
        <article data-index="02">
          <span>2</span>
          <h3>归一化</h3>
          <p>把每组权重映射到单位空间，像把全国地点放进同一张标准地图。</p>
        </article>
        <article data-index="03">
          <span>3</span>
          <h3>找最近站</h3>
          <p>在 <code>h(θ)</code> 生成的候选站点里，找到距离 <code>w_g</code> 最近的 <code>θ*</code>。</p>
        </article>
        <article data-index="04">
          <span>4</span>
          <h3>只存索引</h3>
          <p>保存 <code>θ*</code>，再加少量 scale/offset。解码时重新计算 <code>h(θ*)</code>。</p>
        </article>
      </div>

      <div class="compression-formula">
        <div>
          <span>编码</span>
          <code>θ* = argmin<sub>θ</sub> || w<sub>g</sub> - h(θ) ||</code>
        </div>
        <div>
          <span>解码</span>
          <code>ŵ<sub>g</sub> = h(θ*)</code>
        </div>
      </div>

      <div class="deep-explain">
        <h3>为什么这就压缩了？</h3>
        <p>
          如果原来一个权重块有 16 个 FP16 数，就要 256 bit。现在如果只存一个 8 bit 或 10 bit 的 <code>θ</code>，
          再加少量缩放参数，存储量就大幅下降。代价是 <code>h(θ*)</code> 只是近似原权重块，
          所以核心问题变成：这条线缠得够不够密、搜索最近站够不够快、误差能不能被模型承受。
        </p>
      </div>
    </section>

    <section id="quantization" class="section site-shell">
      <div class="section-heading wide-heading">
        <p class="eyebrow">05 / For VQ and INR</p>
        <h2>它和向量量化、INR 的关系</h2>
      </div>

      <div class="compare-grid">
        <article class="compare-card">
          <span>VQ</span>
          <h3>显式 codebook</h3>
          <p>先存一张码本 <code>C = {c_i}</code>，每个向量存最近码字的 index。优点是查表快；缺点是码本本身要存，而且容量受码本大小限制。</p>
        </article>
        <article class="compare-card featured">
          <span>HC</span>
          <h3>隐式 codebook</h3>
          <p>不把所有码字显式列出来，而是用 <code>h(θ)</code> 按需生成。<code>θ</code> 是索引，函数轨迹是码本。</p>
        </article>
        <article class="compare-card">
          <span>INR</span>
          <h3>共同点与区别</h3>
          <p>共同点是都用函数表示对象；区别是常见 INR 多是训练 MLP 从坐标映射到信号，而 HC 论文里的 HF 更像无理缠绕生成器，不是“用 INR MLP 产生权重”。</p>
        </article>
      </div>

      <div class="qa-band">
        <div>
          <h3>HC 提到 INR，是不是用 INR 产生权重？</h3>
          <p>
            它借用了 INR 的“用函数隐式表示数据”的思想，但核心实现不是常规 INR 训练一个神经网络来生成权重。
            论文里的 hyperfunction 主要通过无理数缠绕构造高维空间中的密集轨迹，再把权重块投到这条轨迹附近。
          </p>
        </div>
        <div>
          <h3>HC 中的 HF 更像什么？</h3>
          <p>
            它更像一个公式化的隐式码本生成器：输入低 bit 的 <code>θ</code>，输出一个高维候选向量。
            从压缩角度看，HF 是“路线规则”；<code>θ</code> 是“站号”；解码是“按规则走到站点并还原近似权重”。
          </p>
        </div>
      </div>
    </section>

    <footer class="references site-shell">
      <h2>参考文献</h2>
      <p>
        [1] F.-L. Fan, J. Fan, D. Wang, J. Zhang, Z. Dong, S. Zhang, G. Wang, and T. Zeng,
        “Hyper-Compression: Model Compression via Hyperfunction,” <em>IEEE Transactions on Pattern Analysis and Machine Intelligence</em>,
        early access, Mar. 13, 2026, doi: 10.1109/TPAMI.2026.3673772. Available:
        <a href="https://ieeexplore.ieee.org/abstract/document/11434864" target="_blank" rel="noreferrer">https://ieeexplore.ieee.org/abstract/document/11434864</a>
      </p>
      <p>
        Map data source: Aliyun DataV GeoAtlas, public China province GeoJSON, cached locally from
        <a href="https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json" target="_blank" rel="noreferrer">https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json</a>.
      </p>
    </footer>
  </main>
`;

const mapRoot = document.querySelector("#china-map-root");

const mapConfig = {
  width: 1000,
  height: 760,
  minVisibleLat: 17,
  route: [
    { label: "城市 A", coords: [116.405285, 39.904989], dx: 18, dy: -18 },
    { label: "城市 B", coords: [114.305392, 30.593099], dx: 18, dy: 4 },
    { label: "城市 C", coords: [113.121416, 23.021548], dx: -92, dy: 22 }
  ]
};

function collectCoordinates(geometry, list = []) {
  if (!geometry) return list;

  const visit = (coords) => {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      list.push(coords);
      return;
    }
    coords.forEach(visit);
  };

  visit(geometry.coordinates);
  return list;
}

function createProjection(features) {
  const coordinates = features
    .flatMap((feature) => collectCoordinates(feature.geometry))
    .filter((point) => point[1] >= mapConfig.minVisibleLat);

  const minLon = Math.min(...coordinates.map((point) => point[0]));
  const maxLon = Math.max(...coordinates.map((point) => point[0]));
  const minLat = Math.min(...coordinates.map((point) => point[1]));
  const maxLat = Math.max(...coordinates.map((point) => point[1]));
  const centerLat = (minLat + maxLat) / 2;
  const lonScale = Math.cos((centerLat * Math.PI) / 180);
  const minX = minLon * lonScale;
  const maxX = maxLon * lonScale;
  const mapWidth = maxX - minX;
  const mapHeight = maxLat - minLat;
  const scale = Math.min(mapConfig.width / mapWidth, mapConfig.height / mapHeight) * 0.9;
  const offsetX = (mapConfig.width - mapWidth * scale) / 2;
  const offsetY = (mapConfig.height - mapHeight * scale) / 2;

  return ([lon, lat]) => ({
    x: offsetX + (lon * lonScale - minX) * scale,
    y: offsetY + (maxLat - lat) * scale
  });
}

function pathFromRing(ring, project) {
  const points = ring
    .filter((point) => point[1] >= mapConfig.minVisibleLat)
    .map(project);

  if (points.length < 3) return "";

  const [first, ...rest] = points;
  const commands = rest.map((point) => `L${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  return `M${first.x.toFixed(1)} ${first.y.toFixed(1)} ${commands} Z`;
}

function pathFromGeometry(geometry, project) {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.map((ring) => pathFromRing(ring, project)).join(" ");
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .flatMap((polygon) => polygon.map((ring) => pathFromRing(ring, project)))
      .join(" ");
  }

  return "";
}

function buildRoutePath(project) {
  const [a, b, c] = mapConfig.route.map((station) => project(station.coords));
  const c1 = { x: a.x + 22, y: a.y + 130 };
  const c2 = { x: b.x - 60, y: b.y - 74 };
  const c3 = { x: b.x + 30, y: b.y + 86 };
  const c4 = { x: c.x - 44, y: c.y - 92 };

  return [
    `M${a.x.toFixed(1)} ${a.y.toFixed(1)}`,
    `C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`,
    `C${c3.x.toFixed(1)} ${c3.y.toFixed(1)} ${c4.x.toFixed(1)} ${c4.y.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`
  ].join(" ");
}

function renderChinaMap(data) {
  const project = createProjection(data.features);
  const routePath = buildRoutePath(project);
  const provincePaths = data.features
    .map((feature) => {
      const name = feature.properties?.name || "";
      const className = name.includes("台湾") ? "map-province is-taiwan" : "map-province";
      const d = pathFromGeometry(feature.geometry, project);
      return d ? `<path class="${className}" d="${d}" />` : "";
    })
    .join("");
  const stations = mapConfig.route
    .map((station) => {
      const point = project(station.coords);
      return `
        <g class="station-marker" transform="translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})">
          <circle r="9" />
          <text x="${station.dx}" y="${station.dy}">${station.label}</text>
        </g>
      `;
    })
    .join("");
  const taiwan = data.features.find((feature) => feature.properties?.name === "台湾省");
  const taiwanCenter = taiwan ? project(taiwan.properties.centroid || taiwan.properties.center) : null;

  mapRoot.classList.remove("map-loading");
  mapRoot.innerHTML = `
    <svg class="china-map" viewBox="0 0 ${mapConfig.width} ${mapConfig.height}" role="img" aria-label="公开中国省级地图与高铁线路示意">
      <defs>
        <linearGradient id="mapRouteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e5b862" />
          <stop offset="48%" stop-color="#36d99d" />
          <stop offset="100%" stop-color="#39c8e8" />
        </linearGradient>
        <filter id="routeGlow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect class="map-ocean" x="0" y="0" width="${mapConfig.width}" height="${mapConfig.height}" rx="22" />
      <g class="province-layer">${provincePaths}</g>
      <path id="trainRouteMap" class="map-route-shadow" d="${routePath}" />
      <path class="map-route" d="${routePath}" />
      ${stations}
      ${
        taiwanCenter
          ? `<text class="map-label taiwan-label-map" x="${(taiwanCenter.x + 24).toFixed(1)}" y="${(taiwanCenter.y + 8).toFixed(1)}">台湾省</text>`
          : ""
      }
      <g class="train-icon-map">
        <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
          <mpath href="#trainRouteMap" />
        </animateMotion>
        <rect x="-16" y="-7" width="32" height="14" rx="7" />
        <path d="M15 0 L26 -7 L26 7 Z" />
      </g>
    </svg>
  `;
}

async function initChinaMap() {
  try {
    const response = await fetch(`${assetBase}data/china.json`);
    if (!response.ok) throw new Error("Map data request failed");
    renderChinaMap(await response.json());
  } catch (error) {
    mapRoot.textContent = "地图数据暂时没有加载成功";
  }
}

initChinaMap();
