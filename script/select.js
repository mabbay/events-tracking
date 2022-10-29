window.addEventListener('message', (e) => {
  if (typeof e.data !== "string") return;
  console.log('--source received');
  const data = JSON.parse(e.data);
  if (!data.target) return;
  const targetWindow = e.source;

  document.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const target = e.target;

    if (target.nodeName.toLowerCase() === 'a') {
      const url = target.attributes.href.value;
      const data = { url };
      targetWindow.postMessage(JSON.stringify(data), '*'); // inform 
      window.open(url, 'selection-window');
      // we can ask: selection or navigation
    } else {
      const path = getPath(target);
      const data = { path };
      targetWindow.postMessage(JSON.stringify(data), '*'); // we will replace '*' with our origin
    }
  }, { capture: true });

  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    const border = target.style.border;
    // to remember the original border
    if (border) target.style.origBorder = border;
    target.style.border = '3px dashed black';
  });
  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    const origBorder = target.style.origBorder;
    if (origBorder)
      target.style.border = origBorder;
    else
      target.style.border = 'none';
  });
});


function getPath(el) {
  if (el.id) return el.nodeName.toLowerCase() + '#' + el.id;
  const stack = [];
  while (el.parentNode != null) {
    // console.log(el.nodeName);
    let sibCount = 0;
    let sibIndex = 0;
    for (let i = 0; i < el.parentNode.childNodes.length; i++) {
      const sib = el.parentNode.childNodes[i];
      if (sib.nodeName.toLowerCase() === el.nodeName.toLowerCase()) {
        sibCount++;
        if (sib === el) {
          sibIndex = sibCount;
        }
      }
    }
    if (el.hasAttribute('id') && el.id != '') {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
    } else if (sibCount > 1) {
      stack.unshift(el.nodeName.toLowerCase() + ':nth-of-type' + '(' + sibIndex + ')');
    } else {
      stack.unshift(el.nodeName.toLowerCase());
    }
    el = el.parentNode;
  }
  return stack.slice(1).join('>'); // removes the html element
}