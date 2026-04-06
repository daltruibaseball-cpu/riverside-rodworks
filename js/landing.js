(function () {
  const quizData = {
    fishingType: null,
    orderType: null,
    priorities: [],
    experience: null,
    budget: null,
    handle: 'cork',
    reelseat: 'fuji',
    wrapColor: '#1a1a2e',
    wrapPattern: 'single',
    length: '6-6-to-7-0',
    guideType: 'standard',
    grip: 'cork'
  };

  let currentStep = 0;

  const steps = document.querySelectorAll('.step');
  const backBtn = document.getElementById('back-btn');
  const progressLabels = document.querySelectorAll('.progress-label');
  const progressSegments = document.querySelectorAll('.progress-segment');

  // --- Color/Option Maps ---

  const handleColorMap = {
    'cork': '#d4a574',
    'split-grip': '#d4a574',
    'eva': '#333333',
    'hybrid': '#8b7355'
  };

  const gripColorMap = {
    'cork': '#c4935a',
    'hypalon': '#2a2a2a',
    'eva': '#3a3a3a'
  };

  const reelseatColorMap = {
    'fuji': '#555555',
    'fuji-skeleton': '#444444',
    'custom-engraved': '#666666'
  };

  const lengthWidthMap = {
    '6-0-to-6-6': 280,
    '6-6-to-7-0': 320,
    '7-0-to-7-6': 360,
    '7-6-plus': 400
  };

  const guideSizeMap = {
    'standard': 1,
    'micro': 0.65,
    'heavy-duty': 1.4
  };

  const labelMap = {
    'freshwater-bass': 'Freshwater Bass',
    'inshore-saltwater': 'Inshore Saltwater',
    'offshore': 'Offshore',
    'fly-fishing': 'Fly Fishing',
    'ice-fishing': 'Ice Fishing',
    'other': 'Other / Custom',
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
    '200-400': '$200–$400',
    '400-600': '$400–$600',
    '600-800': '$600–$800',
    '800-plus': '$800+',
    'unsure': 'Budget TBD',
    'cork': 'Cork',
    'split-grip': 'Split Grip',
    'eva': 'EVA Foam',
    'hybrid': 'Hybrid',
    'hypalon': 'Hypalon',
    'fuji': 'Fuji DPS',
    'fuji-skeleton': 'Fuji Skeleton',
    'custom-engraved': 'Custom Engraved',
    'single': 'Single Wrap',
    'tiger': 'Tiger Wrap',
    'diamond': 'Diamond Wrap',
    'spiral': 'Spiral Wrap',
    'standard': 'Standard Guides',
    'micro': 'Micro Guides',
    'heavy-duty': 'Heavy Duty Guides',
    '6-0-to-6-6': "6'0\"–6'6\"",
    '6-6-to-7-0': "6'6\"–7'0\"",
    '7-0-to-7-6': "7'0\"–7'6\"",
    '7-6-plus': "7'6\"+"
  };

  const colorNameMap = {
    '#1a1a2e': 'Midnight',
    '#8b0000': 'Crimson',
    '#1b4332': 'Forest',
    '#1a3a6c': 'Royal Blue',
    '#b87333': 'Copper',
    '#f5f5f0': 'Pearl White',
    '#722f37': 'Burgundy',
    'custom': 'Custom'
  };

  // --- Price Estimation ---

  const basePrices = {
    'freshwater-bass': 300,
    'inshore-saltwater': 350,
    'offshore': 450,
    'fly-fishing': 380,
    'ice-fishing': 250,
    'other': 350
  };

  const priceModifiers = {
    handle: { 'cork': 0, 'split-grip': 10, 'eva': -20, 'hybrid': 15 },
    reelseat: { 'fuji': 0, 'fuji-skeleton': 25, 'custom-engraved': 60 },
    wrapPattern: { 'single': 0, 'tiger': 30, 'diamond': 45, 'spiral': 25 },
    guideType: { 'standard': 0, 'micro': 35, 'heavy-duty': 20 },
    grip: { 'cork': 0, 'hypalon': 10, 'eva': -10 },
    length: { '6-0-to-6-6': -20, '6-6-to-7-0': 0, '7-0-to-7-6': 15, '7-6-plus': 30 }
  };

  function calculatePrice() {
    var base = basePrices[quizData.fishingType] || 350;
    var total = base;
    total += priceModifiers.handle[quizData.handle] || 0;
    total += priceModifiers.reelseat[quizData.reelseat] || 0;
    total += priceModifiers.wrapPattern[quizData.wrapPattern] || 0;
    total += priceModifiers.guideType[quizData.guideType] || 0;
    total += priceModifiers.grip[quizData.grip] || 0;
    total += priceModifiers.length[quizData.length] || 0;
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

  // --- Smart Routing (fishing-type-specific builder options) ---

  const fishingTypeConfig = {
    'freshwater-bass': {
      lengths: ['6-0-to-6-6', '6-6-to-7-0', '7-0-to-7-6', '7-6-plus'],
      defaultLength: '6-6-to-7-0'
    },
    'inshore-saltwater': {
      lengths: ['6-6-to-7-0', '7-0-to-7-6', '7-6-plus'],
      defaultLength: '7-0-to-7-6'
    },
    'offshore': {
      lengths: ['6-0-to-6-6', '6-6-to-7-0', '7-0-to-7-6'],
      defaultLength: '6-6-to-7-0'
    },
    'fly-fishing': {
      lengths: ['7-0-to-7-6', '7-6-plus'],
      defaultLength: '7-6-plus'
    },
    'ice-fishing': {
      lengths: ['6-0-to-6-6'],
      defaultLength: '6-0-to-6-6'
    },
    'other': {
      lengths: ['6-0-to-6-6', '6-6-to-7-0', '7-0-to-7-6', '7-6-plus'],
      defaultLength: '6-6-to-7-0'
    }
  };

  function applySmartRouting() {
    var config = fishingTypeConfig[quizData.fishingType] || fishingTypeConfig['other'];

    // Show/hide length segments based on fishing type
    var lengthSegs = document.querySelectorAll('.length-seg');
    lengthSegs.forEach(function (seg) {
      var val = seg.getAttribute('data-length');
      if (config.lengths.indexOf(val) > -1) {
        seg.style.display = '';
      } else {
        seg.style.display = 'none';
      }
    });

    // Set default length if current selection is hidden
    if (config.lengths.indexOf(quizData.length) === -1) {
      quizData.length = config.defaultLength;
      lengthSegs.forEach(function (s) { s.classList.remove('selected'); });
      var defaultSeg = document.querySelector('.length-seg[data-length="' + config.defaultLength + '"]');
      if (defaultSeg) defaultSeg.classList.add('selected');
    }
  }

  // --- Core Navigation ---

  function goToStep(n) {
    if (n < 0 || n >= steps.length) return;

    // Exit animation on current step
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

      if (n === 6) onEnterBuilder();
      if (n === 7) onEnterQuote();
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
    var quizDone = currentStep > 5;
    var buildDone = currentStep > 6;
    var inQuiz = currentStep >= 1 && currentStep <= 5;
    var inBuild = currentStep === 6;
    var inQuote = currentStep >= 7;

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
    applySmartRouting();
    updateRodPreview();
    updatePriceDisplay();
    startSocialProof();
  }

  function updateRodPreview() {
    var preview = document.getElementById('rod-preview');
    if (!preview) return;

    var wrapColor = quizData.wrapColor === 'custom' ? '#c9a84c' : quizData.wrapColor;
    var handleColor = handleColorMap[quizData.handle] || '#d4a574';
    var gripColor = gripColorMap[quizData.grip] || '#c4935a';
    var reelseatColor = reelseatColorMap[quizData.reelseat] || '#555555';

    // Update SVG elements by class
    var blanks = preview.querySelectorAll('.svg-blank');
    blanks.forEach(function (el) { el.setAttribute('fill', 'var(--accent)'); el.style.fill = 'var(--accent)'; });

    var wraps = preview.querySelectorAll('.svg-wrap');
    wraps.forEach(function (el) { el.setAttribute('fill', wrapColor); el.style.fill = wrapColor; });

    var guides = preview.querySelectorAll('.svg-guide');
    var scale = guideSizeMap[quizData.guideType] || 1;
    guides.forEach(function (el) {
      el.setAttribute('stroke', wrapColor);
      el.style.stroke = wrapColor;
      el.style.transform = 'scale(' + scale + ')';
      el.style.transformOrigin = 'center bottom';
    });

    var handles = preview.querySelectorAll('.svg-handle');
    handles.forEach(function (el) { el.setAttribute('fill', handleColor); el.style.fill = handleColor; });

    var grips = preview.querySelectorAll('.svg-grip');
    grips.forEach(function (el) { el.setAttribute('fill', gripColor); el.style.fill = gripColor; });

    var reel = preview.querySelectorAll('.svg-reelseat');
    reel.forEach(function (el) { el.setAttribute('fill', reelseatColor); el.style.fill = reelseatColor; });

    // Update rod blank width based on length
    var svg = preview.querySelector('svg');
    if (svg) {
      var w = lengthWidthMap[quizData.length] || 320;
      var ratio = w / 320;
      svg.style.transform = 'rotate(-2deg) scaleX(' + ratio + ')';
    }

    // Update wrap pattern visual on guides
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
        params.set(key, val);
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
    // Show first one after 8 seconds, then every 25 seconds
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
    // Only show during builder step
    if (currentStep !== 6) { stopSocialProof(); return; }

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
    var chips = [];

    if (quizData.fishingType) chips.push(labelMap[quizData.fishingType] || quizData.fishingType);
    if (quizData.orderType) chips.push(labelMap[quizData.orderType] || quizData.orderType);
    quizData.priorities.forEach(function (p) {
      chips.push(labelMap[p] || p);
    });
    if (quizData.experience) chips.push(labelMap[quizData.experience] || quizData.experience);
    if (quizData.budget) chips.push(labelMap[quizData.budget] || quizData.budget);

    if (containerId === 'quote-summary') {
      chips.push('Handle: ' + (labelMap[quizData.handle] || quizData.handle));
      chips.push('Reel Seat: ' + (labelMap[quizData.reelseat] || quizData.reelseat));
      chips.push('Wrap: ' + (colorNameMap[quizData.wrapColor] || quizData.wrapColor));
      chips.push('Pattern: ' + (labelMap[quizData.wrapPattern] || quizData.wrapPattern));
      chips.push('Length: ' + (labelMap[quizData.length] || quizData.length));
      chips.push('Guides: ' + (labelMap[quizData.guideType] || quizData.guideType));
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
        orderType: quizData.orderType,
        priorities: quizData.priorities,
        experience: quizData.experience,
        budget: quizData.budget
      },
      build: {
        handle: quizData.handle,
        reelseat: quizData.reelseat,
        wrapColor: quizData.wrapColor,
        wrapPattern: quizData.wrapPattern,
        length: quizData.length,
        guideType: quizData.guideType,
        grip: quizData.grip
      },
      estimatedPrice: calculatePrice()
    };

    // TODO: POST to webhook endpoint (Formspree, n8n, etc.)
    console.log('Quote request submitted:', JSON.stringify(formData, null, 2));

    goToStep(8);
  }

  // --- Init ---

  document.addEventListener('DOMContentLoaded', function () {
    // Check for shared build link
    var hasBuild = decodeBuild();
    if (hasBuild) {
      // Jump straight to builder with decoded data
      setTimeout(function () { goToStep(6); }, 100);
    }

    // Start button
    document.getElementById('start-btn').addEventListener('click', function () {
      goToStep(1);
    });

    // Back button
    backBtn.addEventListener('click', goBack);

    // Quiz cards (single-select)
    document.querySelectorAll('.quiz-card').forEach(function (card) {
      var field = card.getAttribute('data-field');
      if (field && field !== 'priorities') {
        card.addEventListener('click', function () { handleQuizCard(card); });
      }
    });

    // Multi-select cards
    document.querySelectorAll('.multi-select .quiz-card').forEach(function (card) {
      card.addEventListener('click', function () { handleQuizCard(card); });
    });

    // Priorities next button
    document.getElementById('priorities-next').addEventListener('click', function () {
      goToStep(4);
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

    // Color swatches
    document.querySelectorAll('.color-swatch').forEach(function (swatch) {
      swatch.addEventListener('click', function () {
        quizData.wrapColor = swatch.getAttribute('data-color');
        document.querySelectorAll('.color-swatch').forEach(function (s) { s.classList.remove('selected'); });
        swatch.classList.add('selected');
        updateRodPreview();
      });
    });

    // Length segments
    document.querySelectorAll('.length-seg').forEach(function (seg) {
      seg.addEventListener('click', function () {
        quizData.length = seg.getAttribute('data-length');
        document.querySelectorAll('.length-seg').forEach(function (s) { s.classList.remove('selected'); });
        seg.classList.add('selected');
        updateRodPreview();
        updatePriceDisplay();
      });
    });

    // Guide type options
    document.querySelectorAll('[data-guidetype]').forEach(function (card) {
      card.addEventListener('click', function () {
        quizData.guideType = card.getAttribute('data-guidetype');
        selectOption(card.parentElement, 'data-guidetype', quizData.guideType);
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
      goToStep(7);
    });

    // Skip to quote
    document.getElementById('skip-to-quote').addEventListener('click', function () {
      goToStep(7);
    });

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
