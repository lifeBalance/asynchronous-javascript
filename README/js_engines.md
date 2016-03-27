# JavaScript engines
When we start working with JS we hear quite a lot of stuff that doesn't make a lot of sense at first, such as:

* JavaScript runs in a **single thread**, or how Node.js is **single threaded**.
* JavaScript has a concurrency model based on an **event loop**.
* Asynchronous code.

To tackle all these big words we are gonna start slowly, explaining concepts like **concurrency** from a generic point of view. Also JavaScript is well known for being the scripting language of the internet, so a good idea would be to understand how browsers work, and stuff like that.

## What's in a browser
Web browsers, there are a lot of them [Google Chrome][1], [Mozila firefox][2], [Microsoft Edge][3], just for naming a few of the most popular ones. Let's take a closer look over **Google Chrome**, no special reason other than being one of my favourites browsers. As we know this browser is a multi-platform application, meaning we have versions for all the major operating systems both **desktop** such as Windows, OS X, Linux, as well as **mobile** OSs, such as Android and IOS. The way that's accomplished is by using a modular approach in the application design, meaning the browser is composed by two modules:

* The **engine** which is the module that does most of the work, and it's common among all platforms. This is the component that perform operations such as:

  * Networking, for example when retrieving the document corresponding to the URL.
  * Rendering the page.
  * Client-side scripting.

* The **host application**, this is the part that acts as an interface between the browser's engine and the host operating system. As you can imagine, each version of Chrome needs a different host application module.

The engine of Chrome is also built using a modular approach, the two main components being:

* The [web browser engine][4], sometimes called **layout engine**, or **rendering engine** is the component that renders the content shown in a page, including markup languages (mostly HTML) and content such as image files, video files, etc. and also formatting information (basically CSS). The rendering engine used by Chrome is named [Blink][5], and it's the one responsible for the rendering of the UI of our webapps. Check these links for an extensive [list of layout engines][6], and a [comparison table][7].
* Then we have the client-side scripting engine, aka the [JavaScript engine][8] since in practice JavaScript is the language used by basically all browsers. In the case of Chrome this engine is named [V8][9]. This engine is very popular and it's being used by many other projects deserving [Node.js][10] special mention.

## The Scripting Engine
A JavaScript engine is a program which interprets and executes JavaScript source code. They are also known as **JavaScript interpreters** since JavaScript belongs to the family of [interpreted programming languages][11]. These engines may even be referred to as [ECMAScript engines][12], since [ECMAScript][13] is the name of the language standard in which JavaScript is based on. In other words, JavaScript is an implementation of ECMAScript.

> From now on we'll often refer to JavaScript as **JS**, just because it's shorter.

As we've mentioned before, **V8** is the JS engine used in Google Chrome, and the one we'll be talking about most of the time, but the majority of what we'll say is applicable to other JS engines. V8 uses [Just-in-time compilation][14](JIT), which means that our JS source code is compiled to [machine code][15] at runtime.

> *At runtime* means *while the program is running*, that's why the JS engine is also known as the **runtime environment**.

To better understand what this means, it's useful to start with the two traditional approaches when running programs:

* **Compiled languages** such as C, or C++ use [ahead-of-time compilation][16](AOT), meaning that we need to compile our programs to machine code before running them. Programs written this way are usually really fast.
* **Interpreted languages** such as Python or Ruby use an **interpreter** which is a program that directly executes the instructions contained in the source code without previously compiling them into machine code. Interpreting code is slower than running the compiled code because the interpreter must analyze each statement in the program each time it is executed and then perform the desired action. This runtime analysis is known as **interpretive overhead**.

**JIT compilation** is a combination of these two traditional approaches. A common implementation of JIT compilation is to first have AOT compilation to and intermediate format known as bytecode (**bytecode compilation**) and then have JIT compilation to machine code (dynamic compilation), rather than interpretation of the bytecode. The [Java programming language][17] follows this approach.

## A JS runtime
As we just said **V8** uses JIT compilation(aka dynamic translation), meaning that compilation is done during the execution of a program, at runtime that's why the engine is also known as the **runtime**. This compilation consists of translation to machine code, which is then executed directly; No intermediate or bytecode format is used.

Even though different browsers may implement their runtime model slightly differently, here we are gonna talk about some essential components present in every JavaScript engine:

* The stack.
* The heap.

> The stack and the heap are both stored in the computer’s **RAM** (Random Access Memory).

Before anything, let's introduce these concepts from a generic point of view.

### What is a stack?
In computer science, a stack is an abstract data type that stores a collection of elements, with two principal operations: **push** and **pop**.

* **push** adds an element to the collection.
* **pop** removes the last element that was added.

The push and pop operations occur only at one end of the structure, referred to as the **top of the stack**.

![push-pop][i1]

The push and pop operations follow an order: the last element pushed (added) at the top of the stack is also the first element popped (removed) from it. That’s why stacks are known as **LIFO** data structures. (Last In, First Out)

### The call stack
In computer science a call stack is a stack data structure that stores information about the active subroutines (functions in JavaScript) of a computer program. This kind of stack is also known as an **execution stack**, **control stack**, **runtime stack**, or **machine stack**, but most of the times is shortened to just “the stack”.

> Every time a function is called, its **execution context** is pushed to the top of the stack.

The main purpose of the call stack is to keep track of the point to which each active subroutine should return control when it finishes executing. As we know the call stack is organized as a **stack** (hence its name), when a function is called it gets pushed onto the stack. With each call the memory address following the call statement, the **return address**, is also pushed onto the stack.

A call stack is composed of **stack frames** (also called activation records or activation frames). These are machine dependent data structures containing subroutine state information. The stack frame usually includes at least the following items (in push order):

* The **arguments** passed to the routine (if any)
* The **return address** we described before.
* The **local variables** of the routine (if any).

Each stack frame corresponds to a call to a subroutine which has not yet terminated with a return. The stack frame at the top of the stack is for the currently executing routine.

For example, consider the following code:
```js
function square(n) {
  return n * n;
}

function circleArea(r) {
  var area = Math.PI * square(r);
  return area;
}

function printCircleArea(r) {
  var result = circleArea(r);
  console.log(`The circle with radius ${r} has an area of ${result.toFixed(2)}`);
}

printCircleArea(4);
```

Let's examine the runtime behaviour of this code:

1. The last line contains a call to `printCircleArea` which causes this function to be pushed onto the call stack.

  ![stack 1][stack01]

2. Inside `printCircleArea` we have a call to `circleArea` which is also pushed onto the stack on top of `printCircleArea`.

  ![stack 2][stack02]

3. Inside `circleArea` we have a call to `square` which, guess what, pushes this function to the top of the stack. At this point we have 3 functions on the stack, one on top of another.

  ![stack 3][stack03]

4. When `square` returns, it gets popped out of the stack. Thanks to its return address, control is taken to the point right after the call was made inside `circleArea`.

  ![stack 4][stack04]

5. Then `circleArea` finishes the assignment, and return the value, and the return address takes the control of the program where the assignment of the `result` variable was made.

  ![stack 5][stack05]

6. Now we have a call to `console.log` which pushes this function onto the stack.

  ![stack 6][stack06]

7. Inside `console.log` we are calling the `toFixed` method which is pushed onto the stack.

  ![stack 7][stack07]

8. When `toFixed` do its thing it gets popped out of the stack.

  ![stack 8][stack08]

9. Then `console.log` finally logs the stuff and also gets popped out.

  ![stack 9][stack09]

10. And `printCircleArea` also gets popped out.

  ![stack 10][stack10]

Bottom line, every time a function is called is pushed onto the stack. There can only be one function at the top of the stack, the one that is currently running. When it finishes execution, it's popped out of the stack. And that's pretty much how the stack works.

The size of the stack is fixed, and can not grow past it’s **fixed size**. So, if there is not enough room on the stack to handle the memory being assigned to it, a stack overflow occurs. This often happens when a lot of nested functions are being called, or if there is an infinite recursive call. Different JavaScript engines likely have different maximum stack sizes, and unless you have a runaway recursive function, you’ve probably never hit this limit

The **arguments** and **local variables** a function use live on the stack, and dissapear as soon as function execution completes.

### The heap
The heap is another area of the computer's memory used by the JavaScript engine. In this area the engine stores things such as:

* Global variables.
* Objects.
* The variables captured by a closure.

> A **closure** is an inner function that has access to the outer (enclosing) function's variables.

So apart from the content they hold, there are a couple of differences between the **stack** and the **heap**:

* The stack is much faster than the heap.
* If the current size of the **heap** is too small to accommodate new memory, then more memory can be added to the heap by the operating system. The **stack** is fixed size.

### The garbage collector
In some programming languages (C, C++) is responsability of the programmer to manually delete data stored on the heap. Other languages like JavaScript or Python use garbage collection to automatically delete memory from the heap, without the programmer having to do anything. In JavaScript we do not have to worry about deallocating objects inside the heap, the garbage collector frees them whenever no reference is pointing to them.

![garbage collector][heap]

JavaScript keeps an eye on the current stack, and in the heap. A **handle** provides a reference to a JavaScript object's location in the heap. An object is considered garbage if it is inaccessible from JavaScript and there are no handles that refer to it. From time to time the garbage collector removes all objects considered to be garbage.

But sometimes, problems in our code may lead to handles not disappearing, so the objects being pointed to are not garbage collected; we call this wasted memory a **Memory Leak**.

## JS runs in a single thread
When we start working with JS we hear quite often how it runs in a **single thread**, or how Node.js is **single threaded**, and that's true, but that's only part of a misunderstood story that we're gonna clear out next. At this point it's important to understand that all the machinery we have described in this section (stack, heap, etc...) it all runs in a single-thread. Cool, but what the heck is a **thread**? We answer that and more in the next section.


---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: #

<!-- links -->
[1]: https://www.google.com/chrome/
[2]: https://www.mozilla.org/en-US/firefox/new/
[3]: https://www.microsoft.com/en-us/windows/microsoft-edge
[4]: https://en.wikipedia.org/wiki/Web_browser_engine
[5]: http://www.chromium.org/blink
[6]: https://en.wikipedia.org/wiki/List_of_layout_engines
[7]: https://en.wikipedia.org/wiki/Comparison_of_web_browser_engines
[8]: https://en.wikipedia.org/wiki/JavaScript_engine
[9]: https://developers.google.com/v8/
[10]: https://nodejs.org/en/
[11]: https://en.wikipedia.org/wiki/Interpreted_language
[12]: https://en.wikipedia.org/wiki/List_of_ECMAScript_engines
[13]: http://www.ecmascript.org/
[14]: https://en.wikipedia.org/wiki/Just-in-time_compilation
[15]: https://en.wikipedia.org/wiki/Machine_code
[16]: https://en.wikipedia.org/wiki/Ahead-of-time_compilation
[17]: https://java.com/en/

<!-- images -->
[i1]: ./images/push-pop.png
[stack01]: ./images/stack/01.png
[stack02]: ./images/stack/02.png
[stack03]: ./images/stack/03.png
[stack04]: ./images/stack/04.png
[stack05]: ./images/stack/05.png
[stack06]: ./images/stack/06.png
[stack07]: ./images/stack/07.png
[stack08]: ./images/stack/08.png
[stack09]: ./images/stack/09.png
[stack10]: ./images/stack/10.png
[heap]: ./images/stack/heap-roots.png
