
## RED: lifecycle

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (1 test | 1 failed) 292ms
   ❯ Pang engine (1)
     × starts ready with three lives then starts and pauses explicitly 288ms

 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  02:26:57
   Duration  5.02s (transform 71%, tests 16%, import 12%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > starts ready with three lives then starts and pauses explicitly
TypeError: Game is not a constructor
 ❯ tests/unit/engine.test.js:5:15
      3| describe('Pang engine', () => {
      4|   it('starts ready with three lives then starts and pauses explicitly'…
      5|     const g = new E.Game();
       |               ^
      6|     expect(g.state).toBe('ready'); expect(g.lives).toBe(3);
      7|     g.start(); expect(g.state).toBe('playing');

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: lifecycle

Command: `npm test`
Exit: 0

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  02:27:29
   Duration  3.51s (import 45%, transform 36%, worker 18%, tests 1%)


```

## RED: movement

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (2 tests | 1 failed) 98ms
   ❯ Pang engine (2)
     × moves at 300 units per second, clamps boundaries, and freezes while paused 87ms

 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  02:28:03
   Duration  3.09s (transform 60%, import 27%, tests 12%, worker 2%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > moves at 300 units per second, clamps boundaries, and freezes while paused
TypeError: g.update is not a function
 ❯ tests/unit/engine.test.js:6:7
      4|   it('moves at 300 units per second, clamps boundaries, and freezes wh…
      5|     const g = new E.Game(); g.start();
      6|     g.update(0.1, {right:true}); expect(g.player.x).toBeCloseTo(510);
       |       ^
      7|     g.update(10, {right:true}); expect(g.player.x).toBe(822);
      8|     g.update(10, {left:true}); expect(g.player.x).toBe(18);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: movement

Command: `npm test`
Exit: 0

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game


 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  02:28:24
   Duration  2.51s (import 46%, transform 42%, worker 11%, tests 1%)


```

## RED: fixed-step

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (3 tests | 1 failed) 192ms
   ❯ Pang engine (3)
     × runs fixed 120Hz simulation independent of frame rate and caps background catch-up 102ms

 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  02:28:52
   Duration  2.62s (transform 39%, worker 29%, tests 20%, import 12%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > runs fixed 120Hz simulation independent of frame rate and caps background catch-up
TypeError: a.advance is not a function
 ❯ tests/unit/engine.test.js:6:29
      4|   it('runs fixed 120Hz simulation independent of frame rate and caps b…
      5|     const a = new E.Game(), b = new E.Game(); a.start(); b.start();
      6|     for(let i=0;i<60;i++) a.advance(1/60,{left:true});
       |                             ^
      7|     for(let i=0;i<30;i++) b.advance(1/30,{left:true});
      8|     expect(a.player.x).toBeCloseTo(b.player.x); expect(a.player.x).toB…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: fixed-step

Command: `npm test`
Exit: 0

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  02:29:14
   Duration  2.10s (transform 53%, import 30%, worker 15%, tests 2%)


```

## RED: levels-and-bounce

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (4 tests | 1 failed) 195ms
   ❯ Pang engine (4)
     × loads five distinct arenas with platforms and large bouncing spheres 178ms

 Test Files  1 failed (1)
      Tests  1 failed | 3 passed (4)
   Start at  02:29:37
   Duration  3.21s (transform 69%, tests 15%, import 9%, worker 7%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > loads five distinct arenas with platforms and large bouncing spheres
AssertionError: Target cannot be null or undefined.
 ❯ tests/unit/engine.test.js:6:22
      4|   it('loads five distinct arenas with platforms and large bouncing sph…
      5|     const g = new E.Game(); g.start();
      6|     expect(E.LEVELS).toHaveLength(5);
       |                      ^
      7|     expect(new Set(E.LEVELS.map(l=>JSON.stringify(l.platforms))).size)…
      8|     expect(g.balls[0].size).toBe(2);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: levels-and-bounce

Command: `npm test`
Exit: 0

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  02:30:22
   Duration  2.79s (transform 51%, import 46%, tests 1%, worker 1%)


```

## RED: harpoons

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (5 tests | 1 failed) 114ms
   ❯ Pang engine (5)
     × fires rising harpoons with cooldown and stops them at platform undersides 17ms

 Test Files  1 failed (1)
      Tests  1 failed | 4 passed (5)
   Start at  02:30:48
   Duration  2.38s (import 45%, transform 35%, tests 18%, worker 1%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > fires rising harpoons with cooldown and stops them at platform undersides
AssertionError: Target cannot be null or undefined.
 ❯ tests/unit/engine.test.js:6:48
      4|   it('fires rising harpoons with cooldown and stops them at platform u…
      5|     const g = new E.Game(); g.start(); g.balls=[];
      6|     g.update(.01,{fire:true}); expect(g.shots).toHaveLength(1);
       |                                                ^
      7|     expect(g.shots[0].x).toBe(g.player.x); const y=g.shots[0].y;
      8|     g.update(.1,{fire:true}); expect(g.shots).toHaveLength(1); expect(…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: harpoons

Command: `npm test`
Exit: 0

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game


 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  02:31:19
   Duration  2.40s (transform 75%, tests 18%, import 4%, worker 2%)


```

## RED: splitting

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (6 tests | 1 failed) 400ms
   ❯ Pang engine (6)
     × splits large to medium to faster small spheres and removes smalls for score 202ms

 Test Files  1 failed (1)
      Tests  1 failed | 5 passed (6)
   Start at  02:31:45
   Duration  3.52s (transform 40%, import 27%, tests 22%, worker 10%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > splits large to medium to faster small spheres and removes smalls for score
AssertionError: expected [ 2 ] to deeply equal [ 1, 1 ]

- Expected
+ Received

  [
-   1,
-   1,
+   2,
  ]

 ❯ tests/unit/engine.test.js:7:36
      5|     const g = new E.Game(); g.start(); g.balls=[E.makeBall(480,200,2)];
      6|     g.shots=[{x:480,y:210,bottom:420}]; g.update(.001);
      7|     expect(g.balls.map(b=>b.size)).toEqual([1,1]); expect(g.score).toB…
       |                                    ^
      8|     expect(g.balls[0].vx).toBe(-155); expect(g.balls[1].vx).toBe(155);
      9|     g.balls=[E.makeBall(480,200,1)]; g.shots=[{x:480,y:210,bottom:420}…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: splitting

Command: `npm test`
Exit: 0

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  02:32:11
   Duration  3.29s (transform 49%, tests 26%, import 24%, worker 1%)


```

## RED: platform-geometry

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (7 tests | 1 failed) 390ms
   ❯ Pang engine (7)
     × resolves circle geometry at platform top, side, underside and corner without sticky overlaps 13ms

 Test Files  1 failed (1)
      Tests  1 failed | 6 passed (7)
   Start at  02:32:43
   Duration  3.80s (import 37%, transform 32%, tests 25%, worker 6%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > resolves circle geometry at platform top, side, underside and corner without sticky overlaps
TypeError: resolvePlatform is not a function
 ❯ tests/unit/engine.test.js:7:42
      5|     const p={x:100,y:100,w:100,h:20};
      6|     for(const [x,y,vx,vy,axis,sign] of [[140,90,30,50,'vy',-1],[90,110…
      7|       const b={x,y,vx,vy,r:12,size:0}; E.resolvePlatform(b,p);
       |                                          ^
      8|       expect(b[axis]*sign).toBeGreaterThan(0);
      9|       const dx=b.x-Math.max(p.x,Math.min(p.x+p.w,b.x)), dy=b.y-Math.ma…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: platform-geometry

Command: `npm test`
Exit: 0

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game


 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  02:33:11
   Duration  3.20s (transform 49%, tests 38%, import 12%, worker 1%)


```

## RED: tunneling-and-trapping

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (8 tests | 1 failed) 593ms
   ❯ Pang engine (8)
     × substeps fast balls against thin platforms and ejects embedded splits 196ms

 Test Files  1 failed (1)
      Tests  1 failed | 7 passed (8)
   Start at  02:33:44
   Duration  4.12s (transform 42%, tests 37%, import 15%, worker 6%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > substeps fast balls against thin platforms and ejects embedded splits
AssertionError: expected 265.3875 to be less than 168
 ❯ tests/unit/engine.test.js:7:26
      5|     const g=new E.Game(); g.start(); g.platforms=[{x:100,y:180,w:200,h…
      6|     g.balls=[{...E.makeBall(180,140,0),vy:5000,vx:210}]; g.update(.025…
      7|     expect(g.balls[0].y).toBeLessThan(180-12); expect(g.balls[0].vy).t…
       |                          ^
      8|     g.balls=[E.makeBall(180,185,2)]; g.shots=[{x:180,y:190,bottom:420}…
      9|     for(const b of g.balls) { const p=g.platforms[0]; expect(Math.hypo…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: tunneling-and-trapping

Command: `npm test`
Exit: 0

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game


 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  02:34:15
   Duration  3.29s (transform 39%, tests 33%, import 22%, worker 6%)


```

## RED: lives-timer-invulnerability

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (9 tests | 1 failed) 595ms
   ❯ Pang engine (9)
     × counts down in simulation time, loses one life per hit, grants grace and ends at zero lives 95ms

 Test Files  1 failed (1)
      Tests  1 failed | 8 passed (9)
   Start at  02:34:56
   Duration  3.50s (tests 43%, transform 30%, import 14%, environment 7%, worker 6%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > counts down in simulation time, loses one life per hit, grants grace and ends at zero lives
AssertionError: expected 90 to be close to 89, received difference is 1, but expected 0.005
 ❯ tests/unit/engine.test.js:5:75
      3| describe('Pang engine', () => {
      4|   it('counts down in simulation time, loses one life per hit, grants g…
      5|     const g=new E.Game();g.start();g.balls=[];g.update(1);expect(g.tim…
       |                                                                           ^
      6|     g.balls=[{...E.makeBall(g.player.x,400,0),vx:0,vy:0}];g.update(.00…
      7|     expect(g.lives).toBe(2);expect(g.invulnerable).toBeGreaterThan(1);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: lives-timer-invulnerability

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (9 tests | 1 failed) 1109ms
   ❯ Pang engine (9)
     × runs fixed 120Hz simulation independent of frame rate and caps background catch-up 97ms

 Test Files  1 failed (1)
      Tests  1 failed | 8 passed (9)
   Start at  02:35:27
   Duration  3.81s (tests 68%, transform 20%, import 12%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > runs fixed 120Hz simulation independent of frame rate and caps background catch-up
AssertionError: expected 500 to be close to 255, received difference is 245, but expected 0.005
 ❯ tests/unit/engine.test.js:64:53
     62|     for(let i=0;i<30;i++) b.advance(1/30,{left:true});
     63|     expect(a.player.x).toBeCloseTo(b.player.x); expect(a.player.x).toB…
     64|     b.advance(20, {right:true}); expect(b.player.x).toBeCloseTo(255);
       |                                                     ^
     65|   });
     66|   it('moves at 300 units per second, clamps boundaries, and freezes wh…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: lives-timer-invulnerability-isolated

Command: `npm test`
Exit: 0

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game


 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  02:36:06
   Duration  6.20s (transform 49%, tests 33%, import 17%)


```

## RED: level-progression

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (10 tests | 1 failed) 718ms
   ❯ Pang engine (10)
     × advances only after clearing each arena and wins the fifth 200ms

 Test Files  1 failed (1)
      Tests  1 failed | 9 passed (10)
   Start at  02:36:39
   Duration  3.80s (tests 44%, transform 42%, import 13%, worker 1%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > advances only after clearing each arena and wins the fifth
AssertionError: expected 'playing' to be 'cleared' // Object.is equality

Expected: "cleared"
Received: "playing"

 ❯ tests/unit/engine.test.js:8:23
      6|     for(let level=0;level<5;level++) {
      7|       expect(g.level).toBe(level);g.balls=[E.makeBall(480,200,0)];g.sh…
      8|       expect(g.state).toBe(level===4?'victory':'cleared');
       |                       ^
      9|       if(level<4){g.nextLevel();expect(g.state).toBe('playing');expect…
     10|     }

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: level-progression

Command: `npm test`
Exit: 0

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game


 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  02:37:25
   Duration  3.50s (tests 63%, import 33%, transform 3%, worker 1%)


```

## RED: clean-restart

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (11 tests | 1 failed) 896ms
   ❯ Pang engine (11)
     × restarts the whole run cleanly even from the final arena 182ms

 Test Files  1 failed (1)
      Tests  1 failed | 10 passed (11)
   Start at  02:37:51
   Duration  4.70s (tests 49%, transform 39%, import 11%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > restarts the whole run cleanly even from the final arena
AssertionError: expected 4 to be +0 // Object.is equality

- Expected
+ Received

- 0
+ 4

 ❯ tests/unit/engine.test.js:6:33
      4|   it('restarts the whole run cleanly even from the final arena', () =>…
      5|     const g=new E.Game();g.start();g.loadLevel(4);g.score=999;g.lives=…
      6|     g.restart();expect(g.level).toBe(0);expect(g.lives).toBe(3);expect…
       |                                 ^
      7|     expect(g.shots).toEqual([]);expect(g.particles).toEqual([]);expect…
      8|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: clean-restart

Command: `npm test`
Exit: 0

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game


 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  02:38:32
   Duration  6.71s (transform 62%, tests 23%, import 14%)


```

## RED: particles

Command: `npm test`
Exit: 1

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game

 ❯ tests/unit/engine.test.js (12 tests | 1 failed) 723ms
   ❯ Pang engine (12)
     × emits bounded particles on pops and expires them while playing 16ms

 Test Files  1 failed (1)
      Tests  1 failed | 11 passed (12)
   Start at  02:39:19
   Duration  5.00s (import 38%, tests 32%, transform 28%, worker 1%)


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/engine.test.js > Pang engine > emits bounded particles on pops and expires them while playing
TypeError: Cannot read properties of undefined (reading 'length')
 ❯ tests/unit/engine.test.js:6:24
      4|   it('emits bounded particles on pops and expires them while playing',…
      5|     const g=new E.Game();g.start();g.balls=[E.makeBall(480,200,2)];g.s…
      6|     expect(g.particles.length).toBeGreaterThan(5);expect(g.particles.l…
       |                        ^
      7|     const x=g.particles[0].x;g.update(.05);expect(g.particles[0].x).no…
      8|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


```

## GREEN: particles

Command: `npm test`
Exit: 0

```text

> pang-aurora@1.0.0 test
> vitest run


 RUN  v5.0.4 /root/pang_game


 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  02:39:55
   Duration  3.69s (tests 54%, transform 33%, import 13%)


```

## RED: browser-playable

Command: `npx playwright test --grep starts a playable`
Exit: 1

```text

Running 1 test using 1 worker

  ✘  1 tests/browser/game.spec.js:4:1 › starts a playable canvas, keyboard movement and sustained fire (12.1s)


  1) tests/browser/game.spec.js:4:1 › starts a playable canvas, keyboard movement and sustained fire 

    Error: expect(locator).toBeVisible() failed

    Locator: getByRole('heading', { name: 'PANG', exact: true })
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" getByRole('heading', { name: 'PANG', exact: true }) with timeout 5000ms
      - waiting for getByRole('heading', { name: 'PANG', exact: true })


      3 | async function game(page,fn){return page.evaluate(async src=>{const {game}=await import('/src/app.js');return (new Function('g',src))(game);},fn);}
      4 | test('starts a playable canvas, keyboard movement and sustained fire',async({page})=>{
    > 5 |   await boot(page); await expect(page.getByRole('heading',{name:'PANG',exact:true})).toBeVisible();
        |                                                                                      ^
      6 |   await page.getByRole('button',{name:'Start expedition'}).click();
      7 |   await page.keyboard.down('ArrowLeft');await page.keyboard.down('Space');await page.clock.runFor(500);
      8 |   await page.keyboard.up('ArrowLeft');await page.keyboard.up('Space');
        at /root/pang_game/tests/browser/game.spec.js:5:86

    Error Context: test-results/game-starts-a-playable-can-06249-movement-and-sustained-fire/error-context.md

  1 failed
    tests/browser/game.spec.js:4:1 › starts a playable canvas, keyboard movement and sustained fire 

```

## GREEN: browser-playable

Command: `npx playwright test --grep starts a playable`
Exit: 1

```text

Running 1 test using 1 worker

  ✘  1 tests/browser/game.spec.js:4:1 › starts a playable canvas, keyboard movement and sustained fire (7.1s)


  1) tests/browser/game.spec.js:4:1 › starts a playable canvas, keyboard movement and sustained fire 

    Error: clock.runFor: TypeError: Failed to execute 'ellipse' on 'CanvasRenderingContext2D': 7 arguments required, but only 6 present.
        at draw (http://127.0.0.1:4173/src/render.js:19:43)
        at frame (http://127.0.0.1:4173/src/app.js:12:109)
        at ClockController._callFirstTimer (<anonymous>:285:20)
        at ClockController._runTo (<anonymous>:120:33)
        at <anonymous>:111:18
        at ClockController._runWithDisabledRealTimeSync (<anonymous>:184:13)
        at ClockController.runFor (<anonymous>:110:16)
        at eval (eval at evaluate (:370:30), <anonymous>:1:33)
        at eval (<anonymous>)
        at UtilityScript.evaluate (<anonymous>:370:30)
        at draw (http://127.0.0.1:4173/src/render.js:19:43)
        at frame (http://127.0.0.1:4173/src/app.js:12:109)
        at ClockController._callFirstTimer (<anonymous>:285:20)
        at ClockController._runTo (<anonymous>:120:33)
        at <anonymous>:111:18
        at ClockController._runWithDisabledRealTimeSync (<anonymous>:184:13)
        at ClockController.runFor (<anonymous>:110:16)
        at eval (eval at evaluate (:370:30), <anonymous>:1:33)
        at UtilityScript.evaluate (<anonymous>:370:30)
        at /root/pang_game/tests/browser/game.spec.js:7:92

    Error Context: test-results/game-starts-a-playable-can-06249-movement-and-sustained-fire/error-context.md

  1 failed
    tests/browser/game.spec.js:4:1 › starts a playable canvas, keyboard movement and sustained fire 

```

## GREEN: browser-playable

Command: `npx playwright test --grep starts a playable`
Exit: 0

```text

Running 1 test using 1 worker

  ✓  1 tests/browser/game.spec.js:4:1 › starts a playable canvas, keyboard movement and sustained fire (9.3s)

  1 passed (26.6s)

```

## RED: browser-lifecycle

Command: `npx playwright test --grep pauses, resumes`
Exit: 1

```text

Running 1 test using 1 worker

  ✘  1 tests/browser/game.spec.js:4:1 › pauses, resumes, restarts, shows instructions and pauses on visibility loss (10.1s)


  1) tests/browser/game.spec.js:4:1 › pauses, resumes, restarts, shows instructions and pauses on visibility loss 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: "paused"
    Received: "playing"

      4 | test('pauses, resumes, restarts, shows instructions and pauses on visibility loss',async({page})=>{
      5 |   await boot(page);await page.getByRole('button',{name:'Start expedition'}).click();
    > 6 |   await page.getByRole('button',{name:'Pause game'}).click();expect(await game(page,'return g.state')).toBe('paused');
        |                                                                                                        ^
      7 |   await page.clock.runFor(1000);expect(await game(page,'return g.timer')).toBe(90);
      8 |   await page.getByRole('button',{name:'Resume expedition'}).click();
      9 |   await page.keyboard.press('KeyP');expect(await game(page,'return g.state')).toBe('paused');await page.keyboard.press('Escape');
        at /root/pang_game/tests/browser/game.spec.js:6:104

    Error Context: test-results/game-pauses-resumes-restar-db554-d-pauses-on-visibility-loss/error-context.md

  1 failed
    tests/browser/game.spec.js:4:1 › pauses, resumes, restarts, shows instructions and pauses on visibility loss 

```

## GREEN: browser-lifecycle

Command: `npx playwright test --grep pauses, resumes`
Exit: 0

```text

Running 1 test using 1 worker

  ✓  1 tests/browser/game.spec.js:4:1 › pauses, resumes, restarts, shows instructions and pauses on visibility loss (21.0s)

  1 passed (31.8s)

```
