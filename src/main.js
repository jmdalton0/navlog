const legFields = ['alt', 'dir', 'vel', 'temp', 'tc', 'wca', 'th', 'var', 'mh', 'dev', 'ch', 'tas', 'gs', 'dist-leg', 'dist-rem', 'time-leg', 'time-rem', 'fuel-leg', 'fuel-rem'];
const profilePhases = ['Climb', 'Cruise', 'Descent'];
const profileFields = ['ias', 'cas', 'vs', 'gph'];
const totalFields = ['dist', 'time', 'fuel'];

let data = {
    shouldCalcTotals: false,
    profile: [],
    fixes: [],
    legs: [],
    totals: {},
};

document.addEventListener('DOMContentLoaded', () => {
    const rawData = localStorage.getItem('data');
    if (rawData) data = JSON.parse(rawData);
    init();
});

function init() {

    if (data.shouldCalcTotals) {
        calcTotals();
    } else {
        dontCalcTotals();
    }

    for (let i = 0; i < profilePhases.length; i++) {
        initProfile(i);
    }

    for (let i = 0; i < data.fixes.length; i++) {
        initFix(i);
    }

    if (data.fixes.length < 1) {
        addFix();
    }

    for (let i = 0; i < data.legs.length; i++) {
        initLeg(i);
    }

    for (let i = 0; i < totalFields.length; i++) {
        initTotal(i);
    }

    let timer;
    let log = document.getElementById('log');
    log.addEventListener('input', () => {

        if (data.shouldCalcTotals) {
            calcTotals();
        }

        clearTimeout(timer);
        timer = setTimeout(() => {
            save();
        }, 500);
    });
}

function reset() {
    if (confirm('This will erase all of your current work. Are you sure you would like to continue?')) {
        document.getElementById('profile').innerHTML = '';
        while (remLeg());
        const viewFixes = document.getElementById('fixes');
        viewFixes.firstElementChild.remove();
        for (let i = 0; i < totalFields.length; i++) {
            const total = document.getElementById(totalFields[i] + '-total');
            total.value = '';
        }

        data.shouldCalcTotals = false;
        data.profile = [];
        data.fixes = [];
        data.legs = [];
        data.totals = {};

        init();
        save();
    }
}

function save() {
    console.log('save');
    localStorage.setItem('data', JSON.stringify(data));
}

function initField(val, listener) {
    const td = document.createElement('td');
    const input = document.createElement('input');
    input.value = val ?? '';
    input.addEventListener('input', listener);
    td.appendChild(input);
    return td;
}

function initProfile(ind) {
    const view = document.getElementById('profile');
    const tr = document.createElement('tr')
    const tdPhase = document.createElement('td');
    tdPhase.innerText = profilePhases[ind];
    tdPhase.classList.add('th');
    tr.appendChild(tdPhase);

    data.profile.push({});
    for (let i = 0; i < profileFields.length; i++) {
        const td = initField(data.profile[ind][profileFields[i]], (e) => {
            data.profile[ind][profileFields[i]] = e.target.value;
        });
        tr.appendChild(td);
    }
    view.appendChild(tr);
}

function initFix(ind) {
    const view = document.getElementById('fixes');
    const tr = document.createElement('tr')
    const td = initField(data.fixes[ind], (e) => {
        data.fixes[ind] = e.target.value;
    });
    td.colSpan = 2;
    tr.appendChild(td);
    const buttons = fixes.lastElementChild;
    buttons.remove();
    view.appendChild(tr);
    view.appendChild(buttons);
}

function initLeg(ind) {
    const view = document.getElementById('legs');
    const tr = document.createElement('tr')
    for (let i = 0; i < legFields.length; i++) {
        const td = initField(data.legs[ind][legFields[i]], (e) => {
            data.legs[ind][legFields[i]] = e.target.value;
        });
        tr.appendChild(td);
    }
    const totals = legs.lastElementChild;
    totals.remove();
    view.appendChild(tr);
    view.appendChild(totals);
}

function initTotal(ind) {
    const total = document.getElementById(totalFields[ind] + '-total');
    total.value = data.totals[totalFields[ind]] ?? '';
    total.addEventListener('input', (e) => {
        data.totals[totalFields[ind]] = e.target.value;
    });
}

function addFix() {
    const ind = data.fixes.push('') - 1;
    initFix(ind);
}

function addLeg() {
    const ind = data.legs.push({}) - 1;
    initLeg(ind);
    addFix();
    save();
}

function remLeg() {
    if (data.legs.length < 1) return false;

    data.fixes.pop();
    data.legs.pop();

    const viewFixes = document.getElementById('fixes');
    const buttons = viewFixes.lastElementChild;
    buttons.remove();
    viewFixes.lastElementChild.remove();
    viewFixes.appendChild(buttons);

    const viewLegs = document.getElementById('legs');
    const totals = viewLegs.lastElementChild;
    totals.remove();
    viewLegs.lastElementChild.remove();
    viewLegs.appendChild(totals);
    save();

    return true;
}

function toggleCalcTotals() {
    data.shouldCalcTotals = !data.shouldCalcTotals;
    if (data.shouldCalcTotals) {
        calcTotals();
    } else {
        dontCalcTotals();
    }
    save();
}

function calcTotals() {
    let control = document.getElementById('switch-calc-totals');
    control.classList.add('switch-on');

    let totalDist = 0;
    let totalTime = 0;
    let totalFuel = 0;
    for (let i = 0; i < data.legs.length; i++) {
        const dist = Number(data.legs[i]['dist-leg']);
        if (Number.isFinite(dist)) {
            totalDist += dist;
        }

        const time = Number(data.legs[i]['time-leg']);
        if (Number.isFinite(time)) {
            totalTime += time;
        }

        const fuel = Number(data.legs[i]['fuel-leg']);
        if (Number.isFinite(fuel)) {
            totalFuel += fuel;
        }
    }
    data.totals['dist'] = totalDist; 
    data.totals['time'] = totalTime; 
    data.totals['fuel'] = totalFuel; 

    document.getElementById('dist-total').value = totalDist;
    document.getElementById('time-total').value = totalTime;
    document.getElementById('fuel-total').value = totalFuel;
}

function dontCalcTotals() {
    let control = document.getElementById('switch-calc-totals');
    control.classList.remove('switch-on');
}
