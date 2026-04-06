(function () {
  var quizData = {
    fishingType: null,
    rodStyle: null,
    technique: null,
    orderType: null,
    priorities: [],
    experience: null,
    budget: null,
    power: null,
    action: null,
    blankMaterial: 'graphite',
    handle: 'cork',
    reelseat: 'fuji-dps-spinning',
    wrapColor: '#1a1a2e',
    trimColor: '#c9a84c',
    wrapPattern: 'single',
    length: 7.0,
    guideRing: 'sic',
    grip: 'cork'
  };

  var currentStep = 0;

  var steps = document.querySelectorAll('.step');
  var backBtn = document.getElementById('back-btn');
  var progressLabels = document.querySelectorAll('.progress-label');
  var progressSegments = document.querySelectorAll('.progress-segment');

  // --- Technique Routing ---

  var techniquesByFishingType = {
    'freshwater-bass': [
      { value: 'finesse', label: 'Finesse / Drop Shot', icon: '🎯', power: 'ML', action: 'XF', blankSuggest: 'graphite' },
      { value: 'jigs', label: 'Jigs & Texas Rig', icon: '🪝', power: 'MH', action: 'F', blankSuggest: 'graphite' },
      { value: 'crankbaits', label: 'Crankbaits & Treble Hooks', icon: '🐟', power: 'M', action: 'Mod', blankSuggest: 'composite' },
      { value: 'topwater', label: 'Topwater', icon: '💥', power: 'M', action: 'F', blankSuggest: 'graphite' },
      { value: 'frogging', label: 'Frogging / Punching', icon: '🐸', power: 'H', action: 'XF', blankSuggest: 'graphite' },
      { value: 'swimbaits', label: 'Swimbaits', icon: '🏊', power: 'MH', action: 'Mod-F', blankSuggest: 'composite' },
      { value: 'general', label: 'General Purpose', icon: '🎣', power: 'M', action: 'F', blankSuggest: 'graphite' }
    ],
    'inshore-saltwater': [
      { value: 'flats', label: 'Light Inshore / Flats', icon: '🏖️', power: 'ML', action: 'F', blankSuggest: 'graphite' },
      { value: 'redfish', label: 'Redfish / Speckled Trout', icon: '🐟', power: 'M', action: 'F', blankSuggest: 'graphite' },
      { value: 'livebait-inshore', label: 'Live Bait / Bottom', icon: '🪱', power: 'MH', action: 'F', blankSuggest: 'composite' },
      { value: 'topwater-salt', label: 'Topwater / Plugs', icon: '💥', power: 'M', action: 'F', blankSuggest: 'graphite' },
      { value: 'heavy-structure', label: 'Heavy Structure', icon: '🪨', power: 'H', action: 'F', blankSuggest: 'composite' }
    ],
    'offshore': [
      { value: 'trolling', label: 'Trolling', icon: '🚤', power: 'H', action: 'Mod', blankSuggest: 'fiberglass' },
      { value: 'jigging-offshore', label: 'Jigging / Bottom Fishing', icon: '⬇️', power: 'H', action: 'F', blankSuggest: 'composite' },
      { value: 'livebait-offshore', label: 'Live Bait / Chunking', icon: '🪱', power: 'MH', action: 'Mod-F', blankSuggest: 'composite' },
      { value: 'standup', label: 'Stand-Up Big Game', icon: '💪', power: 'XH', action: 'Mod', blankSuggest: 'fiberglass' },
      { value: 'popping', label: 'Popping / Plugging', icon: '🎯', power: 'H', action: 'XF', blankSuggest: 'graphite' }
    ],
    'fly-fishing': [
      { value: 'dryfly', label: 'Dry Fly / Small Stream', icon: '🪶', power: 'UL-L', action: 'Mod-F', blankSuggest: 'graphite' },
      { value: 'nymphing', label: 'Nymphing', icon: '🐛', power: 'M', action: 'Mod', blankSuggest: 'graphite' },
      { value: 'streamer', label: 'Streamer', icon: '🐟', power: 'MH', action: 'F', blankSuggest: 'graphite' },
      { value: 'saltfly', label: 'Saltwater Fly', icon: '🌊', power: 'MH-H', action: 'F', blankSuggest: 'graphite' }
    ],
    'ice-fishing': [
      { value: 'panfish-ice', label: 'Panfish / Perch', icon: '🐟', power: 'UL', action: 'F', blankSuggest: 'graphite' },
      { value: 'walleye-ice', label: 'Walleye', icon: '🎣', power: 'M', action: 'F', blankSuggest: 'graphite' },
      { value: 'pike-ice', label: 'Pike / Lake Trout', icon: '🦈', power: 'MH', action: 'F', blankSuggest: 'composite' }
    ],
    'other': [
      { value: 'general', label: 'General Purpose', icon: '🎣', power: 'M', action: 'F', blankSuggest: 'graphite' },
      { value: 'custom-spec', label: 'I Have Specific Specs', icon: '📋', power: null, action: null, blankSuggest: null }
    ]
  };

  // --- Length Config by Fishing Type ---

  var lengthsByFishingType = {
    'freshwater-bass': { min: 6.0, max: 8.0, default: 7.0, step: 2 },
    'inshore-saltwater': { min: 6.5, max: 8.0, default: 7.0, step: 2 },
    'offshore': { min: 5.5, max: 7.5, default: 6.5, step: 2 },
    'fly-fishing': { min: 7.0, max: 10.0, default: 9.0, step: 6 },
    'ice-fishing': { min: 2.0, max: 4.0, default: 2.5, step: 2 },
    'other': { min: 5.0, max: 10.0, default: 7.0, step: 2 }
  };

  function formatLength(decimalFeet) {
    var feet = Math.floor(decimalFeet);
    var inches = Math.round((decimalFeet - feet) * 12);
    if (inches === 12) { feet++; inches = 0; }
    return feet + "'" + inches + '"';
  }

  function getLengthValues(fishingType) {
    var config = lengthsByFishingType[fishingType] || lengthsByFishingType['other'];
    var values = [];
    var stepFeet = config.step / 12;
    for (var v = config.min; v <= config.max + 0.001; v += stepFeet) {
      values.push(Math.round(v * 100) / 100);
    }
    return values;
  }

  // --- Color/Option Maps ---

  var handleColorMap = {
    'cork': '#d4a574',
    'split-grip': '#d4a574',
    'eva': '#333333',
    'hybrid': '#8b7355'
  };

  var gripColorMap = {
    'cork': '#c4935a',
    'hypalon': '#2a2a2a',
    'eva': '#3a3a3a'
  };

  var reelseatColorMap = {
    'fuji-dps-spinning': '#555555',
    'fuji-dps-casting': '#555555',
    'fuji-skeleton': '#444444',
    'fuji-trigger': '#4a4a4a',
    'custom-engraved': '#666666'
  };

  var labelMap = {
    'freshwater-bass': 'Freshwater Bass',
    'inshore-saltwater': 'Inshore Saltwater',
    'offshore': 'Offshore',
    'fly-fishing': 'Fly Fishing',
    'ice-fishing': 'Ice Fishing',
    'other': 'Other / Custom',
    'spinning': 'Spinning',
    'casting': 'Casting/Baitcaster',
    'finesse': 'Finesse / Drop Shot',
    'jigs': 'Jigs & Texas Rig',
    'crankbaits': 'Crankbaits & Treble Hooks',
    'topwater': 'Topwater',
    'frogging': 'Frogging / Punching',
    'swimbaits': 'Swimbaits',
    'general': 'General Purpose',
    'flats': 'Light Inshore / Flats',
    'redfish': 'Redfish / Speckled Trout',
    'livebait-inshore': 'Live Bait / Bottom',
    'topwater-salt': 'Topwater / Plugs',
    'heavy-structure': 'Heavy Structure',
    'trolling': 'Trolling',
    'jigging-offshore': 'Jigging / Bottom Fishing',
    'livebait-offshore': 'Live Bait / Chunking',
    'standup': 'Stand-Up Big Game',
    'popping': 'Popping / Plugging',
    'dryfly': 'Dry Fly / Small Stream',
    'nymphing': 'Nymphing',
    'streamer': 'Streamer',
    'saltfly': 'Saltwater Fly',
    'panfish-ice': 'Panfish / Perch',
    'walleye-ice': 'Walleye',
    'pike-ice': 'Pike / Lake Trout',
    'custom-spec': 'I Have Specific Specs',
    'individual': 'Individual Rod',
    'small-batch': 'Small Batch',
    'bulk': 'Bulk / Team Order',
    'performance': 'Performance',
    'aesthetics': 'Aesthetics',
    'durability': 'Durability',
    'lightweight': 'Lightweight',
    'value': 'Value',
    'weekend': 'Weekend Warrior',
    'serious': 'Serious Angler',
    'tournament': 'Tournament Competitor',
    'guide': 'Guide / Captain',
    '200-400': '$200\u2013$400',
    '400-600': '$400\u2013$600',
    '600-800': '$600\u2013$800',
    '800-plus': '$800+',
    'unsure': 'Budget TBD',
    'graphite': 'Graphite',
    'fiberglass': 'Fiberglass',
    'composite': 'Composite',
    'cork': 'Cork',
    'split-grip': 'Split Grip',
    'eva': 'EVA Foam',
    'hybrid': 'Hybrid',
    'hypalon': 'Hypalon',
    'fuji-dps-spinning': 'Fuji DPS (Spinning)',
    'fuji-dps-casting': 'Fuji DPS (Casting)',
    'fuji-skeleton': 'Fuji Skeleton',
    'fuji-trigger': 'Fuji Trigger',
    'custom-engraved': 'Custom Engraved',
    'single': 'Single Wrap',
    'tiger': 'Tiger Wrap',
    'diamond': 'Diamond Wrap',
    'spiral': 'Spiral Wrap',
    'alox': 'Aluminum Oxide',
    'sic': 'Silicon Carbide (SiC)',
    'torzite': 'Torzite',
    'gold': 'Gold',
    'silver': 'Silver',
    'white': 'White',
    'black': 'Black',
    'match': 'Match Primary',
    'none': 'None'
  };

  var colorNameMap = {
    '#1a1a2e': 'Midnight',
    '#8b0000': 'Crimson',
    '#1b4332': 'Forest',
    '#1a3a6c': 'Royal Blue',
    '#b87333': 'Copper',
    '#f5f5f0': 'Pearl White',
    '#722f37': 'Burgundy',
    'custom': 'Custom'
  };

  var trimColorNameMap = {
    '#c9a84c': 'Gold',
    '#c0c0c0': 'Silver',
    '#f5f5f0': 'White',
    '#1a1a1a': 'Black',
    'match': 'Match Primary',
    'none': 'None'
  };

  // --- Price Estimation ---

  var basePrices = {
    'freshwater-bass': 300,
    'inshore-saltwater': 350,
    'offshore': 450,
    'fly-fishing': 380,
    'ice-fishing': 250,
    'other': 350
  };

  var priceModifiers = {
    blankMaterial: { 'graphite': 0, 'fiberglass': -30, 'composite': 20 },
    handle: { 'cork': 0, 'split-grip': 10, 'eva': -20, 'hybrid': 15 },
    reelseat: { 'fuji-dps-spinning': 0, 'fuji-dps-casting': 0, 'fuji-skeleton': 25, 'fuji-trigger': 10, 'custom-engraved': 60 },
    wrapPattern: { 'single': 0, 'tiger': 30, 'diamond': 45, 'spiral': 25 },
    guideRing: { 'alox': 0, 'sic': 40, 'torzite': 90 },
    grip: { 'cork': 0, 'hypalon': 10, 'eva': -10 }
  };

  function calculatePrice() {
    var base = basePrices[quizData.fishingType] || 350;
    var total = base;
    total += priceModifiers.blankMaterial[quizData.blankMaterial] || 0;
    total += priceModifiers.handle[quizData.handle] || 0;
    total += priceModifiers.reelseat[quizData.reelseat] || 0;
    total += priceModifiers.wrapPattern[quizData.wrapPattern] || 0;
    total += priceModifiers.guideRing[quizData.guideRing] || 0;
    total += priceModifiers.grip[quizData.grip] || 0;
    return Math.round(total / 10) * 10;
  }

  function updatePriceDisplay() {
    var el = document.getElementById('price-value');
    if (!el) return;
    var price = calculatePrice();
    el.textContent = '$' + price;
    el.classList.add('updating');
    setTimeout(function () { el.classList.remove('updating'); }, 300);
  }

  // --- Dynamic Technique Step ---

  function buildTechniqueCards() {
    var techniques = techniquesByFishingType[quizData.fishingType] || techniquesByFishingType['other'];
    var container = document.getElementById('technique-grid');
    if (!container) return;

    var html = '';
    techniques.forEach(function (t) {
      html += '<div class="quiz-card" data-field="technique" data-value="' + t.value + '">';
      html += '<span class="card-icon">' + t.icon + '</span>';
      html += '<span class="card-label">' + t.label + '</span>';
      html += '</div>';
    });
    container.innerHTML = html;

    container.querySelectorAll('.quiz-card').forEach(function (card) {
      card.addEventListener('click', function () {
        handleTechniqueCard(card);
      });
    });
  }

  function handleTechniqueCard(card) {
    var value = card.getAttribute('data-value');
    quizData.technique = value;

    var techniques = techniquesByFishingType[quizData.fishingType] || techniquesByFishingType['other'];
    var match = null;
    for (var i = 0; i < techniques.length; i++) {
      if (techniques[i].value === value) { match = techniques[i]; break; }
    }

    if (match) {
      quizData.power = match.power;
      quizData.action = match.action;
      if (match.blankSuggest) {
        quizData.blankMaterial = match.blankSuggest;
      }
    }

    var siblings = card.parentElement.querySelectorAll('.quiz-card');
    siblings.forEach(function (s) { s.classList.remove('selected'); });
    card.classList.add('selected');

    setTimeout(function () {
      goToStep(currentStep + 1);
    }, 300);
  }

  // --- Core Navigation ---
  // Steps: 0=Hero, 1=FishingType, 2=SpinningOrCasting, 3=Technique, 4=OrderType, 5=Priorities, 6=Experience, 7=Budget, 8=Builder, 9=QuoteForm, 10=ThankYou

  function goToStep(n) {
    if (n < 0 || n >= steps.length) return;

    var currentEl = steps[currentStep];
    currentEl.classList.add('exiting');

    setTimeout(function () {
      steps.forEach(function (s) {
        s.classList.remove('active', 'exiting');
      });
      currentStep = n;
      var target = steps[n];
      target.classList.add('active');
      updateProgress();
      updateBackBtn();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var heading = target.querySelector('h1, h2');
      if (heading) heading.focus();

      if (n === 3) buildTechniqueCards();
      if (n === 8) onEnterBuilder();
      if (n === 9) onEnterQuote();
    }, 250);
  }

  function goBack() {
    if (currentStep > 0) goToStep(currentStep - 1);
  }

  function updateBackBtn() {
    if (currentStep === 0) {
      backBtn.classList.remove('visible');
    } else {
      backBtn.classList.add('visible');
    }
  }

  function updateProgress() {
    var quizDone = currentStep > 7;
    var buildDone = currentStep > 8;
    var inQuiz = currentStep >= 1 && currentStep <= 7;
    var inBuild = currentStep === 8;
    var inQuote = currentStep >= 9;

    progressLabels.forEach(function (l) { l.classList.remove('active', 'completed'); });
    progressSegments.forEach(function (s) { s.classList.remove('active', 'completed'); });

    if (inQuiz) {
      progressLabels[0].classList.add('active');
      progressSegments[0].classList.add('active');
    } else if (quizDone) {
      progressLabels[0].classList.add('completed');
      progressSegments[0].classList.add('completed');
    }

    if (inBuild) {
      progressLabels[1].classList.add('active');
      progressSegments[1].classList.add('active');
    } else if (buildDone) {
      progressLabels[1].classList.add('completed');
      progressSegments[1].classList.add('completed');
    }

    if (inQuote) {
      progressLabels[2].classList.add('active');
      progressSegments[2].classList.add('active');
    }
  }

  // --- Quiz Logic ---

  function handleQuizCard(card) {
    var field = card.getAttribute('data-field');
    var value = card.getAttribute('data-value');

    if (field === 'priorities') {
      handleMultiSelect(card, value);
      return;
    }

    quizData[field] = value;

    var siblings = card.parentElement.querySelectorAll('.quiz-card');
    siblings.forEach(function (s) { s.classList.remove('selected'); });
    card.classList.add('selected');

    setTimeout(function () {
      goToStep(currentStep + 1);
    }, 300);
  }

  function handleMultiSelect(card, value) {
    var idx = quizData.priorities.indexOf(value);
    if (idx > -1) {
      quizData.priorities.splice(idx, 1);
      card.classList.remove('selected');
    } else {
      if (quizData.priorities.length >= 2) return;
      quizData.priorities.push(value);
      card.classList.add('selected');
    }
    var nextBtn = document.getElementById('priorities-next');
    nextBtn.disabled = quizData.priorities.length === 0;
  }

  // --- Builder Logic ---

  function onEnterBuilder() {
    buildChips('quiz-summary');
    var msg = getMessaging(quizData);
    document.getElementById('builder-heading').textContent = msg.heading;
    configureReelSeatOptions();
    configureLengthSlider();
    applyBlankMaterialFromTechnique();
    updateRodPreview();
    updatePriceDisplay();
    startSocialProof();
  }

  function applyBlankMaterialFromTechnique() {
    var blankCards = document.querySelectorAll('[data-blankmaterial]');
    blankCards.forEach(function (c) { c.classList.remove('selected'); });
    var target = document.querySelector('[data-blankmaterial="' + quizData.blankMaterial + '"]');
    if (target) target.classList.add('selected');
  }

  function configureReelSeatOptions() {
    var allReelseats = document.querySelectorAll('[data-reelseat]');
    allReelseats.forEach(function (card) {
      var val = card.getAttribute('data-reelseat');
      if (quizData.rodStyle === 'casting') {
        if (val === 'fuji-dps-spinning' || val === 'fuji-skeleton') {
          card.style.display = 'none';
        } else {
          card.style.display = '';
        }
      } else {
        if (val === 'fuji-dps-casting' || val === 'fuji-trigger') {
          card.style.display = 'none';
        } else {
          card.style.display = '';
        }
      }
    });

    // Set default reel seat based on rod style
    if (quizData.rodStyle === 'casting') {
      if (quizData.reelseat === 'fuji-dps-spinning' || quizData.reelseat === 'fuji-skeleton') {
        quizData.reelseat = 'fuji-dps-casting';
      }
    } else {
      if (quizData.reelseat === 'fuji-dps-casting' || quizData.reelseat === 'fuji-trigger') {
        quizData.reelseat = 'fuji-dps-spinning';
      }
    }
    var activeReelseat = document.querySelector('[data-reelseat="' + quizData.reelseat + '"]');
    allReelseats.forEach(function (c) { c.classList.remove('selected'); });
    if (activeReelseat) activeReelseat.classList.add('selected');
  }

  function configureLengthSlider() {
    var slider = document.getElementById('length-slider');
    var display = document.getElementById('length-display');
    if (!slider || !display) return;

    var values = getLengthValues(quizData.fishingType);
    var config = lengthsByFishingType[quizData.fishingType] || lengthsByFishingType['other'];

    slider.min = 0;
    slider.max = values.length - 1;
    slider.step = 1;

    // Find closest index to default
    var defaultVal = config.default;
    var closestIdx = 0;
    var closestDist = Math.abs(values[0] - defaultVal);
    for (var i = 1; i < values.length; i++) {
      var dist = Math.abs(values[i] - defaultVal);
      if (dist < closestDist) { closestDist = dist; closestIdx = i; }
    }

    slider.value = closestIdx;
    quizData.length = values[closestIdx];
    display.textContent = formatLength(values[closestIdx]);

    slider._lengthValues = values;

    slider.oninput = function () {
      var idx = parseInt(slider.value);
      var val = values[idx];
      quizData.length = val;
      display.textContent = formatLength(val);
      updateRodPreview();
      updatePriceDisplay();
    };
  }

  function updateRodPreview() {
    var preview = document.getElementById('rod-preview');
    if (!preview) return;

    var wrapColor = quizData.wrapColor === 'custom' ? '#c9a84c' : quizData.wrapColor;
    var handleColor = handleColorMap[quizData.handle] || '#d4a574';
    var gripColor = gripColorMap[quizData.grip] || '#c4935a';
    var reelseatColor = reelseatColorMap[quizData.reelseat] || '#555555';

    var blanks = preview.querySelectorAll('.svg-blank');
    blanks.forEach(function (el) { el.setAttribute('fill', 'var(--accent)'); el.style.fill = 'var(--accent)'; });

    var wraps = preview.querySelectorAll('.svg-wrap');
    wraps.forEach(function (el) { el.setAttribute('fill', wrapColor); el.style.fill = wrapColor; });

    var guides = preview.querySelectorAll('.svg-guide');
    guides.forEach(function (el) {
      el.setAttribute('stroke', wrapColor);
      el.style.stroke = wrapColor;
    });

    var handles = preview.querySelectorAll('.svg-handle');
    handles.forEach(function (el) { el.setAttribute('fill', handleColor); el.style.fill = handleColor; });

    var grips = preview.querySelectorAll('.svg-grip');
    grips.forEach(function (el) { el.setAttribute('fill', gripColor); el.style.fill = gripColor; });

    var reel = preview.querySelectorAll('.svg-reelseat');
    reel.forEach(function (el) { el.setAttribute('fill', reelseatColor); el.style.fill = reelseatColor; });

    var svg = preview.querySelector('svg');
    if (svg) {
      var baseWidth = 320;
      var ratio = (quizData.length / 7.0);
      svg.style.transform = 'rotate(-2deg) scaleX(' + ratio + ')';
    }

    var patternClass = 'pattern-' + quizData.wrapPattern;
    var assembly = preview.querySelector('.rod-assembly-svg');
    if (assembly) {
      assembly.className = 'rod-assembly-svg ' + patternClass;
    }
  }

  function selectOption(group, attr, value) {
    var cards = group.querySelectorAll('[' + attr + ']');
    cards.forEach(function (c) { c.classList.remove('selected'); });
    var target = group.querySelector('[' + attr + '="' + value + '"]');
    if (target) target.classList.add('selected');
  }

  function getMessaging(data) {
    if (data.technique === 'trolling') {
      return { heading: "Let's Build Your Trolling Workhorse" };
    }
    if (data.technique === 'finesse') {
      return { heading: "Let's Dial In Your Finesse Setup" };
    }
    if (data.technique === 'frogging') {
      return { heading: "Let's Build Something That Rips Through Cover" };
    }
    if (data.technique === 'dryfly') {
      return { heading: "Let's Craft Your Perfect Fly Rod" };
    }
    if (data.experience === 'guide' && data.orderType === 'bulk') {
      return { heading: "Let's Design Your Fleet's Signature Rod" };
    }
    if (data.experience === 'tournament' && data.priorities.indexOf('performance') > -1) {
      return { heading: "Let's Dial In Your Competitive Edge" };
    }
    if (data.priorities.indexOf('aesthetics') > -1) {
      return { heading: "Let's Make Something Beautiful" };
    }
    if (data.fishingType === 'fly-fishing') {
      return { heading: "Let's Build Your Perfect Fly Rod" };
    }
    if (data.fishingType === 'offshore') {
      return { heading: "Let's Build Something That Handles the Big Ones" };
    }
    return { heading: "Let's Design Your Rod" };
  }

  // --- Save/Share Build ---

  function encodeBuild() {
    var params = new URLSearchParams();
    Object.keys(quizData).forEach(function (key) {
      var val = quizData[key];
      if (Array.isArray(val)) {
        if (val.length) params.set(key, val.join(','));
      } else if (val !== null) {
        params.set(key, String(val));
      }
    });
    return window.location.origin + window.location.pathname + '?build=' + btoa(params.toString());
  }

  function decodeBuild() {
    var url = new URL(window.location.href);
    var buildParam = url.searchParams.get('build');
    if (!buildParam) return false;
    try {
      var decoded = atob(buildParam);
      var params = new URLSearchParams(decoded);
      params.forEach(function (val, key) {
        if (key === 'priorities') {
          quizData[key] = val.split(',');
        } else if (key === 'length') {
          quizData[key] = parseFloat(val);
        } else if (key in quizData) {
          quizData[key] = val;
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  function copyBuildLink() {
    var link = encodeBuild();
    navigator.clipboard.writeText(link).then(function () {
      var btn = document.getElementById('save-build-btn');
      var original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 2000);
    });
  }

  // --- Social Proof Notifications ---

  var socialProofData = [
    { name: 'Mike T.', action: 'just ordered a custom bass rod', time: '2 hours ago' },
    { name: 'Captain Dave', action: 'built 6 rods for his charter fleet', time: '5 hours ago' },
    { name: 'Sarah K.', action: 'designed a tournament rod in Crimson', time: '1 day ago' },
    { name: 'Josh R.', action: 'just finished his tiger wrap build', time: '3 hours ago' },
    { name: 'Tommy L.', action: 'ordered a custom inshore rod', time: '6 hours ago' },
    { name: 'Ryan M.', action: 'built a matching set of 3 rods', time: '1 day ago' }
  ];

  var socialProofTimer = null;
  var socialProofIndex = 0;

  function startSocialProof() {
    if (socialProofTimer) return;
    socialProofTimer = setTimeout(function () {
      showSocialProof();
      socialProofTimer = setInterval(function () {
        showSocialProof();
      }, 25000);
    }, 8000);
  }

  function stopSocialProof() {
    if (socialProofTimer) {
      clearInterval(socialProofTimer);
      clearTimeout(socialProofTimer);
      socialProofTimer = null;
    }
    var toast = document.getElementById('social-proof-toast');
    if (toast) toast.classList.remove('visible');
  }

  function showSocialProof() {
    if (currentStep !== 8) { stopSocialProof(); return; }

    var toast = document.getElementById('social-proof-toast');
    if (!toast) return;
    var data = socialProofData[socialProofIndex % socialProofData.length];
    socialProofIndex++;

    var avatar = toast.querySelector('.toast-avatar');
    var name = toast.querySelector('.toast-name');
    var action = toast.querySelector('.toast-action');
    var time = toast.querySelector('.toast-time');

    avatar.textContent = data.name.charAt(0);
    name.textContent = data.name;
    action.textContent = data.action;
    time.textContent = data.time;

    toast.classList.add('visible');

    setTimeout(function () {
      toast.classList.remove('visible');
    }, 5000);
  }

  // --- Quote Logic ---

  function onEnterQuote() {
    buildChips('quote-summary');
    stopSocialProof();
    var bulkFields = document.getElementById('bulk-fields');
    if (quizData.orderType === 'bulk') {
      bulkFields.classList.add('visible');
    } else {
      bulkFields.classList.remove('visible');
    }
  }

  function buildChips(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var chips = [];

    if (quizData.fishingType) chips.push(labelMap[quizData.fishingType] || quizData.fishingType);
    if (quizData.rodStyle) chips.push(labelMap[quizData.rodStyle] || quizData.rodStyle);
    if (quizData.technique) chips.push(labelMap[quizData.technique] || quizData.technique);
    if (quizData.power) chips.push('Power: ' + quizData.power);
    if (quizData.action) chips.push('Action: ' + quizData.action);
    if (quizData.orderType) chips.push(labelMap[quizData.orderType] || quizData.orderType);
    quizData.priorities.forEach(function (p) {
      chips.push(labelMap[p] || p);
    });
    if (quizData.experience) chips.push(labelMap[quizData.experience] || quizData.experience);
    if (quizData.budget) chips.push(labelMap[quizData.budget] || quizData.budget);

    if (containerId === 'quote-summary') {
      chips.push('Blank: ' + (labelMap[quizData.blankMaterial] || quizData.blankMaterial));
      chips.push('Handle: ' + (labelMap[quizData.handle] || quizData.handle));
      chips.push('Reel Seat: ' + (labelMap[quizData.reelseat] || quizData.reelseat));
      chips.push('Wrap: ' + (colorNameMap[quizData.wrapColor] || quizData.wrapColor));
      chips.push('Trim: ' + (trimColorNameMap[quizData.trimColor] || quizData.trimColor));
      chips.push('Pattern: ' + (labelMap[quizData.wrapPattern] || quizData.wrapPattern));
      chips.push('Length: ' + formatLength(quizData.length));
      chips.push('Guides: ' + (labelMap[quizData.guideRing] || quizData.guideRing));
      chips.push('Grip: ' + (labelMap[quizData.grip] || quizData.grip));

      var price = calculatePrice();
      chips.push('Est. Price: $' + price);
    }

    container.innerHTML = chips.map(function (c) {
      return '<span class="chip">' + c + '</span>';
    }).join('');
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var firstName = form.querySelector('#first-name');
    var lastName = form.querySelector('#last-name');
    var email = form.querySelector('#email');

    if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim()) {
      if (!firstName.value.trim()) firstName.focus();
      else if (!lastName.value.trim()) lastName.focus();
      else email.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.focus();
      return;
    }

    var formData = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      phone: form.querySelector('#phone').value.trim(),
      quantity: form.querySelector('#quantity').value || null,
      teamName: form.querySelector('#team-name').value.trim() || null,
      notes: form.querySelector('#notes').value.trim(),
      quiz: {
        fishingType: quizData.fishingType,
        rodStyle: quizData.rodStyle,
        technique: quizData.technique,
        power: quizData.power,
        action: quizData.action,
        orderType: quizData.orderType,
        priorities: quizData.priorities,
        experience: quizData.experience,
        budget: quizData.budget
      },
      build: {
        blankMaterial: quizData.blankMaterial,
        handle: quizData.handle,
        reelseat: quizData.reelseat,
        wrapColor: quizData.wrapColor,
        trimColor: quizData.trimColor,
        wrapPattern: quizData.wrapPattern,
        length: formatLength(quizData.length),
        guideRing: quizData.guideRing,
        grip: quizData.grip
      },
      estimatedPrice: calculatePrice()
    };

    console.log('Quote request submitted:', JSON.stringify(formData, null, 2));

    goToStep(10);
  }

  // --- Init ---

  document.addEventListener('DOMContentLoaded', function () {
    var hasBuild = decodeBuild();
    if (hasBuild) {
      setTimeout(function () { goToStep(8); }, 100);
    }

    // Start button
    document.getElementById('start-btn').addEventListener('click', function () {
      goToStep(1);
    });

    // Back button
    backBtn.addEventListener('click', goBack);

    // Quiz cards (single-select) — excludes technique cards (built dynamically) and priorities
    document.querySelectorAll('.quiz-card').forEach(function (card) {
      var field = card.getAttribute('data-field');
      if (field && field !== 'priorities' && field !== 'technique') {
        card.addEventListener('click', function () { handleQuizCard(card); });
      }
    });

    // Multi-select cards
    document.querySelectorAll('.multi-select .quiz-card').forEach(function (card) {
      card.addEventListener('click', function () { handleQuizCard(card); });
    });

    // Priorities next button
    document.getElementById('priorities-next').addEventListener('click', function () {
      goToStep(6);
    });

    // Blank material options
    document.querySelectorAll('[data-blankmaterial]').forEach(function (card) {
      card.addEventListener('click', function () {
        quizData.blankMaterial = card.getAttribute('data-blankmaterial');
        selectOption(card.parentElement, 'data-blankmaterial', quizData.blankMaterial);
        updateRodPreview();
        updatePriceDisplay();
      });
    });

    // Handle options
    document.querySelectorAll('[data-handle]').forEach(function (card) {
      card.addEventListener('click', function () {
        quizData.handle = card.getAttribute('data-handle');
        selectOption(card.parentElement, 'data-handle', quizData.handle);
        updateRodPreview();
        updatePriceDisplay();
      });
    });

    // Reel seat options
    document.querySelectorAll('[data-reelseat]').forEach(function (card) {
      card.addEventListener('click', function () {
        quizData.reelseat = card.getAttribute('data-reelseat');
        selectOption(card.parentElement, 'data-reelseat', quizData.reelseat);
        updateRodPreview();
        updatePriceDisplay();
      });
    });

    // Thread pattern options
    document.querySelectorAll('[data-pattern]').forEach(function (option) {
      option.addEventListener('click', function () {
        quizData.wrapPattern = option.getAttribute('data-pattern');
        document.querySelectorAll('[data-pattern]').forEach(function (o) { o.classList.remove('selected'); });
        option.classList.add('selected');
        updateRodPreview();
        updatePriceDisplay();
      });
    });

    // Primary color swatches
    document.querySelectorAll('.color-swatch:not(.trim-swatch)').forEach(function (swatch) {
      swatch.addEventListener('click', function () {
        quizData.wrapColor = swatch.getAttribute('data-color');
        document.querySelectorAll('.color-swatch:not(.trim-swatch)').forEach(function (s) { s.classList.remove('selected'); });
        swatch.classList.add('selected');
        updateRodPreview();
      });
    });

    // Trim/accent color swatches
    document.querySelectorAll('.trim-swatch').forEach(function (swatch) {
      swatch.addEventListener('click', function () {
        quizData.trimColor = swatch.getAttribute('data-trim');
        document.querySelectorAll('.trim-swatch').forEach(function (s) { s.classList.remove('selected'); });
        swatch.classList.add('selected');
        updateRodPreview();
      });
    });

    // Guide ring options
    document.querySelectorAll('[data-guidering]').forEach(function (card) {
      card.addEventListener('click', function () {
        quizData.guideRing = card.getAttribute('data-guidering');
        selectOption(card.parentElement, 'data-guidering', quizData.guideRing);
        updateRodPreview();
        updatePriceDisplay();
      });
    });

    // Grip options
    document.querySelectorAll('[data-grip]').forEach(function (card) {
      card.addEventListener('click', function () {
        quizData.grip = card.getAttribute('data-grip');
        selectOption(card.parentElement, 'data-grip', quizData.grip);
        updateRodPreview();
        updatePriceDisplay();
      });
    });

    // Continue to quote
    document.getElementById('to-quote-btn').addEventListener('click', function () {
      goToStep(9);
    });

    // Skip to quote
    var skipBtn = document.getElementById('skip-to-quote');
    if (skipBtn) {
      skipBtn.addEventListener('click', function () {
        goToStep(9);
      });
    }

    // Save build link
    var saveBtn = document.getElementById('save-build-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', copyBuildLink);
    }

    // Quote form
    document.getElementById('quote-form').addEventListener('submit', handleFormSubmit);

    // Init state
    updateProgress();
    updateBackBtn();
  });
})();
