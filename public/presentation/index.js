const doneButton = document.getElementById("done-button");

let actionQueu = [];

Reveal.addEventListener('fragmentshown', function( event )
{
  if (event.fragment.dataset.dequeue)
  {
    dequeue();
  }
  if (event.fragment.dataset.queue)
  {
    actionQueu.push([event.fragment.dataset.queue, event.fragment]);
  }
  if (event.fragment.dataset.action)
  {
    execAction(event.fragment.dataset.action, event.fragment);
  }
});

Reveal.configure({
  keyboard: {
    13: dequeue
  }
});

function dequeue()
{
  if (actionQueu.length == 0)
    return;
  let [action, fragment] = actionQueu.pop();
  if (action)
    execAction(action, fragment);
}


document.body.addEventListener("click", onClick, false);
document.body.addEventListener("change", onChange, false);

document.querySelectorAll('[data-hover="highlight-feature"]').forEach((elem) => 
{
  const featuresList = document.querySelector("#features-list");
  elem.addEventListener("mouseover", (e) =>
  {
    let action = findParentData(e.target, "info", false);
    featuresList.className = "";
    if (action)
      featuresList.classList.add(action);
  }, false);
  elem.addEventListener("mouseout", (e) =>
  {
    featuresList.className = "";
  });
});

function onClick(e)
{
  let actions = findParentData(e.target, "click-action", false);
  if (!actions)
    return;

  actions = actions.split(",");
  for (let action of actions)
  {
    execAction(action, e.target);
  }
}

function onChange(e)
{
  let actions = findParentData(e.target, "change", false);
  if (!actions)
    return;
  actions = actions.split(",");
  for (let action of actions)
  {
    execAction(action, e.target);
  }
}

function findParentData(element, dataName, returnElement)
{
  element = element.closest(`[data-${dataName}]`);
  if (!element)
    return null;
  if (returnElement)
    return element;
  return element.getAttribute(`data-${dataName}`);
}

function findSection(el)
{
  while (el = el.parentElement)
  {
    if (el.tagName.toLowerCase() == "section")
      return el;
  } 
}

function execAction(action, element)
{
  switch (action)
  {
    case "set-button-german":
      doneButton.textContent = "Fertigstellen";
      break;
    case "add-flexible-width":
      doneButton.style.width = "100%";
      break;
    case "move-item-up":
      element.closest(".order").classList.add("reorder");
      break;
    case "remove-removable":
      const removable = findSection(element).querySelector(".removable:not(.remove)");
      if (removable)
        removable.classList.add("remove");
      break;
    case "play-animation":
      element.closest(".jump-chars").classList.toggle("play");
      break;
    case "set-header-rtl": {
      const wrapper = element.closest(".common-rtl-issues");
      wrapper.querySelector(".header").setAttribute("dir", "rtl");
      wrapper.querySelector(".header").setAttribute("lang", "ar");
      wrapper.querySelector(".html.target").style.display = "none";
      wrapper.querySelector(".html.source").style.display = "block";
    }
      break;
    case "adjust-rtl": {
      const wrapper = element.closest(".common-rtl-issues");
      wrapper.querySelector(".header").classList.add("adjust");
    }
      break;
    case "play-char-jumper": 
    element.closest(".intro").querySelector(".char-jumper").classList.add("play");
      break;
  }
}
