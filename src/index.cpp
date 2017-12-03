#include "asm-dom.hpp"
#include <emscripten/val.h>
#include <functional>
#include <string>

void Render();
asmdom::VNode *current_view = nullptr;

// State.
int i = 1;
std::vector<std::string> actions;

// Actions.
bool Decrease(emscripten::val) {
  i--;
  actions.push_back("Decrease");
  Render();
  return true;
}

bool Increase(emscripten::val) {
  i++;
  actions.push_back("Increase");
  Render();
  return true;
}

// Render the view (i.e. replace the main virtual dom).
void Render() {
  asmdom::VNode* decrease_button = 
    <a (onclick)={Decrease} class="button">
      Decrease
    </a>;

  asmdom::VNode* increase_button = 
    <a (onclick)={Increase} class="button">
      Increase
    </a>;

  // Limit the number of actions to 10.
  asmdom::VNode *action_list = <ul class = "action_list"></ ul>;
  int start = std::max(0, (int)actions.size() - 10);
  asmdom::Children actions_list;
  for (int i = start; i < actions.size(); ++i) {
    std::string label = "action[" + std::to_string(i) + "] = " + actions[i];
    action_list->children.push_back(<li>{label}</ li>);
  }

  // The main view.
  asmdom::VNode* new_node =
    <div class="root">
      <h1> This interface has been written in C++!</ h1>

      <div class="button_container">
        {decrease_button}
        {increase_button}
      </div>

      <div class="display_i">
        i = {{std::to_string(i)}}
      </div>

      {action_list}
    </div>;

  asmdom::patch(current_view, new_node);
  current_view = new_node;
}

int main() {

  // Initialize asm-dom.
  asmdom::Config config = asmdom::Config();
  asmdom::init(config);

  // Replace <div id="root"/> by our virtual dom.
  emscripten::val document = emscripten::val::global("document");
  emscripten::val root =
      document.call<emscripten::val>("getElementById", std::string("root"));
  current_view = <div>Initial view</div>;
  asmdom::patch(root, current_view);

  // Update the virtual dom.
  Render();

  return 0;
};
