 
    /* ======================================================
       DATA
    ====================================================== */
    const IMAGES = [
      { src: "upshift 1.jpeg", category: "Community",       title: "Community Outreach",       description: "Engaging with the local community." },
      { src: "Upshift 2.jpeg", category: "Education",       title: "Learning Session",         description: "Students participating in a learning session." },
      { src: "Upshift 3.jpeg", category: "Healthcare",      title: "Health Checkup",           description: "Providing basic health checkups." },
      { src: "Upshift 4.jpeg", category: "Environment",     title: "Tree Planting",            description: "Volunteers planting trees for a greener environment." },
      { src: "Upshift 5.jpeg", category: "Community",       title: "Group Activity",           description: "Collaborative group activity." },
      { src: "Upshift 6.jpeg", category: "Education",       title: "Workshop",                 description: "Interactive workshop for skill development." },
      { src: "Upshift 7.jpeg", category: "Healthcare",      title: "Medical Camp",             description: "Free medical camp for the community." },
      { src: "Upshift 8.jpeg", category: "Environment",     title: "Clean-up Drive",           description: "Community clean-up initiative." },
      { src: "Upshift 9.jpeg", category: "Community",       title: "Youth Gathering",          description: "Gathering of youth for empowerment programs." },
      { src: "Upshift 10.jpeg", category: "Education",      title: "Mentorship Program",       description: "Mentors guiding young individuals." },
      { src: "Upshift 11.jpeg", category: "Healthcare",     title: "Awareness Campaign",       description: "Health awareness campaign." },
      { src: "Upshift 12.jpeg", category: "Environment",    title: "Recycling Initiative",     description: "Promoting recycling in the community." },
      { src: "upshift leticia.png", category: "Community",  title: "Leticia's Story",          description: "A personal story of impact." },
      { src: "marvin.PNG", category: "Education",           title: "Marvin's Class",           description: "Marvin leading an educational class." },
      { src: "mission.png", category: "Community",          title: "Our Mission in Action",    description: "Bringing our mission to life." },
      { src: "motivation.jpeg", category: "Education",      title: "Motivational Session",     description: "Boosting motivation among participants." },
      { src: "nelson.jpg", category: "Community",           title: "Nelson's Leadership",      description: "Nelson demonstrating leadership." },
      { src: "pret.PNG", category: "Education",             title: "Creative Arts",            description: "Children engaged in creative arts." },
      { src: "story.jpeg", category: "Community",           title: "Impact Story",             description: "A story of change and impact." },
      { src: "USYEI.PNG", category: "Operations",           title: "USYEI Logo",               description: "The official logo of USYEI." },
      { src: "vision.jpeg", category: "Community",          title: "Our Vision",               description: "Working towards our organizational vision." },
      { src: "WhatsApp Image 2026-04-03 at 09.51.15.jpeg", category: "Community", title: "Community Event", description: "A recent community event." }
    ];

    /* ======================================================
       SHADERS
    ====================================================== */
    const VERT = `
      #define PI 3.14159265359
      attribute float aAngle; attribute float aHeight; attribute float aRadius;
      attribute float aAspectRatio; attribute float aSpeed; attribute vec4 aTextureCoords;
      varying vec4 vTextureCoords; varying vec2 vUv;
      uniform float uMaxZ; uniform float uZrange; uniform float uScrollY; uniform float uSpeedY;
      uniform float uRotateY;
      vec4 qFromAxis(vec3 axis, float angle) { float h = angle * 0.5; return vec4(axis * sin(h), cos(h)); }
      void main() {
        vec3 scaledPos = position; scaledPos.y /= aAspectRatio;
        float zPos = aHeight + uScrollY; float minZ = uMaxZ - uZrange;
        zPos = mod(zPos - minZ, uZrange) + minZ;
        /* All images share the same speed factor (no aSpeed variation) so their
           relative arrangement is preserved. uRotateY lets the user orbit horizontally. */
        float theta = aAngle + uSpeedY * 0.4 + uRotateY;
        vec3 iPos = vec3(cos(theta) * aRadius, zPos, sin(theta) * aRadius);
        float angle = atan(iPos.x, iPos.z);
        vec4 rot = qFromAxis(vec3(0.0,1.0,0.0), angle);
        vec3 finalPos = scaledPos + 2.0 * cross(rot.xyz, cross(rot.xyz, scaledPos) + rot.w * scaledPos);
        vec4 worldPos = modelMatrix * vec4(iPos + finalPos, 1.0);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
        vUv = uv; vTextureCoords = aTextureCoords;
      }`;

    const FRAG = `
      varying vec4 vTextureCoords; varying vec2 vUv; uniform sampler2D uAtlas;
      void main() {
        vec2 atlasUV;
        atlasUV.x = mix(vTextureCoords.x, vTextureCoords.y, vUv.x);
        atlasUV.y = mix(vTextureCoords.z, vTextureCoords.w, 1.0 - vUv.y);
        gl_FragColor = texture2D(uAtlas, atlasUV);
      }`;

    const CV_VERT = `varying vec2 vUv; void main() { gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); vUv = uv; }`;
    const CV_FRAG = `
      varying vec2 vUv; uniform sampler2D uAtlas; uniform vec4 uTextureCoords;
      void main() {
        vec2 uv;
        uv.x = mix(uTextureCoords.x, uTextureCoords.y, vUv.x);
        uv.y = mix(uTextureCoords.z, uTextureCoords.w, 1.0 - vUv.y);
        gl_FragColor = texture2D(uAtlas, uv);
      }`;

    /* ======================================================
       VORTEX GALLERY ENGINE
    ====================================================== */
    class VortexGallery {
      constructor(canvas, imagesData, onProgress) {
        this.canvas = canvas; this.imagesData = imagesData; this.onProgress = onProgress;
        this.disposed = false; this.paused = false;
        this.scrollY = { speedTarget:0, speedCurrent:0, target:0, current:0, direction:1 };
        this.rotateY = { target:0, current:0 }; /* horizontal orbit state */
        this.imageInfos = []; this.centerMesh = null; this.activeIndices = null;
        this.scene = new THREE.Scene(); this.scene.background = new THREE.Color(0xf7f4ef);
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 200);
        this.camera.position.z = 5;
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this._setupEvents();
        this.init();
      }
      async init() { await this._loadAtlas(this.imagesData); this._buildInstanced(); this._buildCenter(); this._render(); }
      async _loadAtlas(data) {
        /* Larger cells = sharper images in the 3D view */
        const CELL_W = 420, CELL_H = 525, cols = Math.ceil(Math.sqrt(data.length)), rows = Math.ceil(data.length/cols);
        const atlasW = cols * CELL_W, atlasH = rows * CELL_H, cvs = document.createElement('canvas');
        cvs.width = atlasW; cvs.height = atlasH; const ctx = cvs.getContext('2d');
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = '#f7f4ef'; ctx.fillRect(0,0,atlasW,atlasH);
        const images = await Promise.all(data.map((imgObj, i) => new Promise(res => {
          const img = new Image(); img.onload = () => { this.onProgress((i+1)/data.length); res(img); };
          img.onerror = () => { this.onProgress((i+1)/data.length); res(null); }; img.src = imgObj.src;
        })));
        this.imageInfos = images.map((img, i) => {
          const col = i % cols, row = Math.floor(i/cols), destX = col * CELL_W, destY = row * CELL_H;
          if (!img) return { uvs:{xStart:0,xEnd:0,yStart:0,yEnd:0}, ...data[i] };
          const ia = img.width/img.height, ca = CELL_W/CELL_H;
          let dw, dh, ox, oy;
          if (ia > ca) { dw = CELL_W; dh = CELL_W/ia; ox = 0; oy = (CELL_H-dh)/2; }
          else { dh = CELL_H; dw = CELL_H*ia; oy = 0; ox = (CELL_W-dw)/2; }
          ctx.drawImage(img, destX+ox, destY+oy, dw, dh);
          return { aspectRatio: ia, uvs: { xStart: (destX+ox)/atlasW, xEnd: (destX+ox+dw)/atlasW, yStart: 1-(destY+oy)/atlasH, yEnd: 1-(destY+oy+dh)/atlasH }, ...data[i] };
        });
        this.atlasTexture = new THREE.CanvasTexture(cvs);
        /* High-quality texture filtering */
        this.atlasTexture.generateMipmaps  = true;
        this.atlasTexture.minFilter        = THREE.LinearMipmapLinearFilter;
        this.atlasTexture.magFilter        = THREE.LinearFilter;
        this.atlasTexture.anisotropy       = this.renderer.capabilities.getMaxAnisotropy();
        this.atlasTexture.needsUpdate      = true;
      }
      _buildInstanced() {
        const geo = new THREE.BoxGeometry(1.5, 1.5, 0.075), COUNT = 600, RADIUS = 6, HEIGHT = 120;
        this.uZrange = HEIGHT; this.uMaxZ = HEIGHT/2; this.instanceCount = COUNT;
        this.instancedMaterial = new THREE.ShaderMaterial({
          vertexShader: VERT, fragmentShader: FRAG, transparent: true,
          uniforms: { uAtlas:{value:this.atlasTexture}, uScrollY:{value:0}, uZrange:{value:HEIGHT}, uMaxZ:{value:HEIGHT/2}, uSpeedY:{value:0}, uRotateY:{value:0} }
        });
        const mesh = new THREE.InstancedMesh(geo, this.instancedMaterial, COUNT);
        const aTC = new Float32Array(COUNT * 4), aAngles = new Float32Array(COUNT), aHeights = new Float32Array(COUNT), aRads = new Float32Array(COUNT), aAR = new Float32Array(COUNT), aSpeeds = new Float32Array(COUNT), aIdx = new Uint16Array(COUNT);
        for(let i=0; i<COUNT; i++){
          const imgIdx = Math.floor(Math.random()*this.imageInfos.length), info = this.imageInfos[imgIdx];
          aTC.set([info.uvs.xStart, info.uvs.xEnd, info.uvs.yStart, info.uvs.yEnd], i*4);
          aAngles[i] = (i/COUNT) * Math.PI * 2; aHeights[i] = (i % 40) * 3 - 60; aRads[i] = RADIUS;
          aAR[i] = info.aspectRatio || 1; aSpeeds[i] = Math.random()*0.2+0.8; aIdx[i] = imgIdx;
        }
        this.instanceData = { angles: aAngles, heights: aHeights, radiuses: aRads, speeds: aSpeeds, imageIndices: aIdx };
        geo.setAttribute('aAngle', new THREE.InstancedBufferAttribute(aAngles, 1));
        geo.setAttribute('aHeight', new THREE.InstancedBufferAttribute(aHeights, 1));
        geo.setAttribute('aRadius', new THREE.InstancedBufferAttribute(aRads, 1));
        geo.setAttribute('aAspectRatio', new THREE.InstancedBufferAttribute(aAR, 1));
        geo.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(aSpeeds, 1));
        geo.setAttribute('aTextureCoords', new THREE.InstancedBufferAttribute(aTC, 4));
        this.instancedMesh = mesh; this.scene.add(mesh);
      }
      _buildCenter() {
        const geo = new THREE.PlaneGeometry(1.7, 2.3);
        this.centerMaterial = new THREE.ShaderMaterial({
          vertexShader: CV_VERT, fragmentShader: CV_FRAG, transparent: true,
          uniforms: { uAtlas:{value:this.atlasTexture}, uTextureCoords:{value:new THREE.Vector4(0,1,0,1)} }
        });
        this.centerMesh = new THREE.Mesh(geo, this.centerMaterial); this.scene.add(this.centerMesh);
      }
      _setupEvents() {
        window.addEventListener('resize', () => {
          this.camera.aspect = window.innerWidth / window.innerHeight; this.camera.updateProjectionMatrix();
          this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        /* ── WHEEL: vertical = move through vortex, horizontal = orbit around it ── */
        window.addEventListener('wheel', (e) => {
          if (this.paused) return;
          const dy = e.deltaY * 0.01;
          const dx = e.deltaX * 0.008;
          this.scrollY.target += dy;
          this.scrollY.speedTarget = Math.max(-8, Math.min(8, this.scrollY.speedTarget + dy));
          this.scrollY.direction = Math.sign(e.deltaY) || 1;
          this.rotateY.target += dx;
        }, { passive: true });

        /* ── MOUSE DRAG: horizontal drag = orbit, vertical drag = scroll through vortex ── */
        let _isDragging = false, _dragX = 0, _dragY = 0;
        this.canvas.addEventListener('mousedown', (e) => {
          _isDragging = true; _dragX = e.clientX; _dragY = e.clientY;
          this.canvas.style.cursor = 'grabbing';
        });
        window.addEventListener('mouseup', () => {
          _isDragging = false;
          this.canvas.style.cursor = 'crosshair';
        });
        window.addEventListener('mousemove', (e) => {
          if (!_isDragging || this.paused) return;
          const dx = e.clientX - _dragX;
          const dy = e.clientY - _dragY;
          _dragX = e.clientX; _dragY = e.clientY;
          this.rotateY.target  += dx * -0.006;
          const vDelta = dy * -0.018;
          this.scrollY.target  += vDelta;
          this.scrollY.speedTarget = Math.max(-8, Math.min(8, this.scrollY.speedTarget + vDelta));
          this.scrollY.direction   = Math.sign(-dy) || 1;
        });

        /* ── TOUCH: horizontal = orbit, vertical = scroll through vortex ── */
        let _touchX = 0, _touchY = 0;
        this.canvas.addEventListener('touchstart', (e) => {
          _touchX = e.touches[0].clientX;
          _touchY = e.touches[0].clientY;
        }, { passive: true });
        this.canvas.addEventListener('touchmove', (e) => {
          if (this.paused) return;
          const dx = _touchX - e.touches[0].clientX;
          const dy = _touchY - e.touches[0].clientY;
          _touchX = e.touches[0].clientX;
          _touchY = e.touches[0].clientY;
          /* Route dominant axis: bigger movement wins to avoid diagonal confusion */
          if (Math.abs(dx) > Math.abs(dy)) {
            this.rotateY.target += dx * 0.006;
          } else {
            const delta = dy * 0.025;
            this.scrollY.target += delta;
            this.scrollY.speedTarget = Math.max(-8, Math.min(8, this.scrollY.speedTarget + delta));
            this.scrollY.direction = Math.sign(dy) || 1;
          }
        }, { passive: true });
      }
      _lerp(a, b, t) { return a + (b - a) * t; }
      _render() {
        if (this.disposed) return; requestAnimationFrame(() => this._render());
        if (!this.paused) {
          this.scrollY.target += 0.004 * this.scrollY.direction;
          this.scrollY.current = this._lerp(this.scrollY.current, this.scrollY.target, 0.1);

          // Decay speedTarget to 0 so rotation returns to rest after scrolling
          this.scrollY.speedTarget  = this._lerp(this.scrollY.speedTarget, 0, 0.06);
          this.scrollY.speedCurrent = this._lerp(this.scrollY.speedCurrent, this.scrollY.speedTarget, 0.1);

          // Lerp horizontal orbit
          this.rotateY.current = this._lerp(this.rotateY.current, this.rotateY.target, 0.08);

          // Keep scroll values bounded to prevent float precision loss after long sessions
          // (shader uses mod() so shifting by exactly uZrange is visually invisible)
          const WRAP = this.uZrange || 120;
          if (Math.abs(this.scrollY.target) > WRAP * 40) {
            const shift = Math.round(this.scrollY.target / WRAP) * WRAP;
            this.scrollY.target  -= shift;
            this.scrollY.current -= shift;
          }
          // Keep rotateY in [-2π*200, +2π*200] to prevent precision drift
          const TWO_PI = Math.PI * 2;
          if (Math.abs(this.rotateY.target) > TWO_PI * 200) {
            const rShift = Math.round(this.rotateY.target / TWO_PI) * TWO_PI;
            this.rotateY.target  -= rShift;
            this.rotateY.current -= rShift;
          }
        }
        if (this.instancedMaterial) {
          this.instancedMaterial.uniforms.uScrollY.value  = this.scrollY.current;
          this.instancedMaterial.uniforms.uSpeedY.value   = this.scrollY.speedCurrent;
          this.instancedMaterial.uniforms.uRotateY.value  = this.rotateY.current;
        }
        const navbar = document.getElementById('navbar'); if(navbar) navbar.classList.toggle('shrink', Math.abs(this.scrollY.current) > 2);
        const pb = document.getElementById('progress-bar'); if(pb && this.uZrange) pb.style.width = ((Math.abs(this.scrollY.current) % this.uZrange) / this.uZrange * 100) + '%';
        if (this.centerMaterial && this.imageInfos.length > 0) {
          const validIndices = this.activeIndices || this.imageInfos.map((_, i) => i);
          if (validIndices.length > 0) {
            const idx = validIndices[Math.abs(Math.floor(this.scrollY.current)) % validIndices.length];
            const uvs = this.imageInfos[idx].uvs;
            this.centerMaterial.uniforms.uTextureCoords.value.set(uvs.xStart, uvs.xEnd, uvs.yStart, uvs.yEnd);
            this.textureIndex = idx;
          }
        }
        this.renderer.render(this.scene, this.camera);
      }
      filterByIndices(indices) {
        this.activeIndices = (indices && indices.length > 0) ? indices : null;
        if (!this.instanceData) return;
        const geo = this.instancedMesh.geometry, aTC = new Float32Array(this.instanceCount * 4), validSet = new Set(this.activeIndices || this.imageInfos.map((_, i) => i));
        for (let i = 0; i < this.instanceCount; i++) {
          let imgIdx = this.instanceData.imageIndices[i];
          if (!validSet.has(imgIdx)) imgIdx = Array.from(validSet)[Math.floor(Math.random()*validSet.size)];
          const u = this.imageInfos[imgIdx].uvs; aTC.set([u.xStart, u.xEnd, u.yStart, u.yEnd], i*4);
        }
        geo.attributes.aTextureCoords.array = aTC; geo.attributes.aTextureCoords.needsUpdate = true;
      }
      pickAtScreen(x, y, rect) {
        const ndcX = ((x - rect.left) / rect.width) * 2 - 1, ndcY = -(((y - rect.top) / rect.height) * 2 - 1);
        const ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
        if (this.centerMesh && ray.intersectObject(this.centerMesh).length > 0) return this.textureIndex;
        return null;
      }
      setPaused(v) { this.paused = v; }
    }

    /* ======================================================
       INITIALIZATION
    ====================================================== */
    let gallery = null;
    function getFilteredIndices(cat) { return cat === 'All' ? null : IMAGES.reduce((acc, img, i) => { if (img.category === cat) acc.push(i); return acc; }, []); }

    window.addEventListener('DOMContentLoaded', () => {
      const canvas = document.getElementById('gl-canvas'), loader = document.getElementById('loader'), lBar = document.getElementById('loader-bar');
      gallery = new VortexGallery(canvas, IMAGES, pct => {
        if(lBar) lBar.style.width = (pct*100)+'%';
        if(pct >= 1) setTimeout(() => loader.classList.add('done'), 500);
      });

      /* ── DESKTOP: click anywhere on canvas ── */
      canvas.addEventListener('click', () => {
        if (gallery.textureIndex != null) showOverlay(gallery.textureIndex);
      });

      /* ── MOBILE: tap to open overlay (distinguishes swipe vs tap) ── */
      let _tapX = 0, _tapY = 0;
      canvas.addEventListener('touchstart', (e) => {
        _tapX = e.touches[0].clientX;
        _tapY = e.touches[0].clientY;
      }, { passive: true });
      canvas.addEventListener('touchend', (e) => {
        const dx = Math.abs(e.changedTouches[0].clientX - _tapX);
        const dy = Math.abs(e.changedTouches[0].clientY - _tapY);
        if (dx < 10 && dy < 10 && gallery.textureIndex != null) {
          showOverlay(gallery.textureIndex);
        }
      }, { passive: true });

      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          gallery.filterByIndices(getFilteredIndices(btn.dataset.cat));
        });
      });

      // Navbar Toggle
      const bar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.width = (window.scrollY / total * 100) + '%';
    });
  
  
  
  
  const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('shrink', window.scrollY > 60);
    }, { passive: true });

    // Hamburger
    const toggle  = document.getElementById('navToggle');
    const mobileM = document.getElementById('mobileMenu');

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileM.classList.toggle('open');
    }, { passive: true });

    mobileM.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.classList.contains('mobile-dropdown-toggle')) {
          const content = link.nextElementSibling;
          if (content) content.classList.toggle('open');
        } else {
          toggle.classList.remove('open');
          mobileM.classList.remove('open');
        }
      });
    });
// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const isInsideNav = navbar.contains(e.target);
  const isInsideMenu = mobileM.contains(e.target);

  if (!isInsideNav && !isInsideMenu && mobileM.classList.contains('open')) {
    toggle.classList.remove('open');
    mobileM.classList.remove('open');
  }
}, { passive: true });


      // Overlay functions
      let currentOverlayIdx = null;

      function showOverlay(idx) {
        const img = IMAGES[idx]; if (!img) return;
        currentOverlayIdx = idx;

        // Main image (desktop left panel)
        document.getElementById('overlay-img').src     = img.src;
        document.getElementById('overlay-img').alt     = img.title;
        // Compact preview inside description panel (visible on mobile)
        document.getElementById('ov-img-preview').src  = img.src;
        document.getElementById('ov-img-preview').alt  = img.title;

        document.getElementById('ov-eyebrow').textContent = img.category;
        document.getElementById('ov-counter').textContent = `${idx + 1} / ${IMAGES.length}`;
        document.getElementById('ov-title').textContent   = img.title;
        document.getElementById('ov-desc').textContent    = img.description;

        // Fill metadata grid
        const meta = document.getElementById('ov-meta');
        meta.innerHTML = `
          <span class="ov-meta-label">Category</span><span>${img.category}</span>
          <span class="ov-meta-label">Image</span><span>${idx + 1} of ${IMAGES.length}</span>
          <span class="ov-meta-label">File</span><span style="opacity:.5;font-size:10px">${img.src}</span>
        `;

        // Mark selected thumbnail (if panel is open)
        document.querySelectorAll('.thumb-item').forEach((t, i) => {
          t.classList.toggle('selected', i === idx);
        });

        document.getElementById('overlay').classList.add('open');
        document.getElementById('close-btn').classList.add('visible');
        document.getElementById('site-header').classList.add('hidden');
        gallery.setPaused(true);
      }

      function closeOverlay() {
        document.getElementById('overlay').classList.remove('open');
        document.getElementById('close-btn').classList.remove('visible');
        document.getElementById('site-header').classList.remove('hidden');
        document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('selected'));
        currentOverlayIdx = null;
        gallery.setPaused(false);
      }

      function navigateOverlay(dir) {
        if (currentOverlayIdx === null) return;
        const next = (currentOverlayIdx + dir + IMAGES.length) % IMAGES.length;
        showOverlay(next);
      }

      document.getElementById('close-btn').addEventListener('click', closeOverlay);
      document.getElementById('ov-close').addEventListener('click', closeOverlay);
      document.getElementById('ov-prev').addEventListener('click', () => navigateOverlay(-1));
      document.getElementById('ov-next').addEventListener('click', () => navigateOverlay(+1));

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!document.getElementById('overlay').classList.contains('open')) return;
        if (e.key === 'Escape')      closeOverlay();
        if (e.key === 'ArrowRight')  navigateOverlay(+1);
        if (e.key === 'ArrowLeft')   navigateOverlay(-1);
      });

      // Swipe left/right inside overlay to navigate (mobile)
      let _ovSwipeX = null;
      document.getElementById('overlay').addEventListener('touchstart', e => {
        _ovSwipeX = e.touches[0].clientX;
      }, { passive: true });
      document.getElementById('overlay').addEventListener('touchend', e => {
        if (_ovSwipeX === null) return;
        const dx = e.changedTouches[0].clientX - _ovSwipeX;
        _ovSwipeX = null;
        if (Math.abs(dx) > 50) navigateOverlay(dx < 0 ? 1 : -1);
      }, { passive: true });

      // Thumbnail Panel
      const thumbToggle = document.getElementById('thumb-toggle'), thumbPanel = document.getElementById('thumb-panel'), thumbGrid = document.getElementById('thumb-grid');
      thumbToggle.addEventListener('click', () => {
        thumbToggle.classList.toggle('open'); thumbPanel.classList.toggle('open');
        if(thumbPanel.classList.contains('open')) buildThumbGrid();
      });

      function buildThumbGrid() {
        thumbGrid.innerHTML = '';
        IMAGES.forEach((img, i) => {
          const div = document.createElement('div');
          div.className = 'thumb-item' + (i === currentOverlayIdx ? ' selected' : '');
          div.dataset.idx = i;
          div.innerHTML = `<img src="${img.src}" alt="${img.title}" title="${img.title}">`;
          div.onclick = () => {
            showOverlay(i);
            thumbToggle.click(); // close panel after selecting
          };
          thumbGrid.appendChild(div);
        });
        document.getElementById('panel-subtitle').textContent = IMAGES.length + ' items in library';
      }
    });
  