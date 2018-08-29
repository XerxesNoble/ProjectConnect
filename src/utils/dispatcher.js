const defaultOptions = {bubbles: true, cancellable: true}

export default function dispatcher(node = document, type, eventOptions = defaultOptions) {
  if (typeof window.CustomEvent === 'function') {
    node.dispatchEvent(new Event(type));
  } else {
    const {bubbles, cancellable} = eventOptions;
    const event = document.createEvent('CustomEvent');
    event.initEvent(type, bubbles, cancellable);
    node.dispatchEvent(event);
  }
}
