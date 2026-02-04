const numInitLegs = 6;
const numColsLeg = 19;

document.addEventListener('DOMContentLoaded', () => {
    addFix();
    for (let i = 0; i < numInitLegs; i++) {
        addLeg();
    }
});

function addLeg() {
    let fix = addFix();

    const legs = document.getElementById('legs');
    const leg = document.createElement('tr');
    const totals = legs.lastElementChild;

    const remTd = document.createElement('td');
    const remBtn = document.createElement('button');
    remBtn.innerText = 'X';
    remBtn.classList.add('btn-rem');
    remBtn.onclick = () => {
        if (leg.parentNode.childElementCount > 2) {
            fix.remove();
            leg.remove();
        };
    };
    remTd.appendChild(remBtn);
    leg.appendChild(remTd);
 
    for (let i = 0; i < numColsLeg; i++) {
        const col = document.createElement('td');
        const input = document.createElement('input');
        input.value = "360";
        col.appendChild(input);
        leg.appendChild(col);
    }

    totals.remove();
    legs.appendChild(leg);
    legs.appendChild(totals);
}

function addFix() {
    const fixes = document.getElementById('fixes');
    const fix = document.createElement('tr')
    const fixTd = document.createElement('td');
    const input = document.createElement('input');
    const addBtn = fixes.lastElementChild;
    fixTd.appendChild(input);
    fix.appendChild(fixTd);
    addBtn.remove();
    fixes.appendChild(fix);
    fixes.appendChild(addBtn);
    return fix;
}
