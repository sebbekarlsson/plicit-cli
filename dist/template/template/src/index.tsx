import { Component, computedSignal, setup, signal } from "plicit";

const App: Component = () => {

  const counter = signal(0);
  
  return <div>
    <span>The counter is { computedSignal(() => counter.get()) }</span>
    <button on={{ click: () => counter.set(x => x+1) }}>Increment</button>
  </div>;
};

setup(App, document.getElementById("app") as any);
