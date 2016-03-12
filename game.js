/**
INVADER BLOCK 5
Copyright (c) 2016, Yoji Suzuki (SUZUKI PLAN)
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met: 

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer. 
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those
of the authors and should not be interpreted as representing official policies, 
either expressed or implied, of the FreeBSD Project.
 */

var MY = new Object();

// スコアを表示（更新）
MY.showScore = function() {
    if (!MY.scoreL) {
        MY.scoreL = new Label("00");
        MY.scoreL.x = 76;
        MY.scoreL.y = 4;
        MY.scoreL.color = "white";
        MY.scoreL.font = "16px Courier"
        MY.g.rootScene.addChild(MY.scoreL);
    }
    MY.score += MY.scoreA * MY.mag.val;
    if (99999999 < MY.score) MY.score = 99999999; // 10億-10でカンスト (テストプレイでは今の所最大30万ぐらい)
    MY.scoreA = 0;
    if (MY.score < 10) {
        MY.scoreL.text = "0000000" + MY.score + "0";
    } else if (MY.score < 100) {
        MY.scoreL.text = "000000" + MY.score + "0";
    } else if (MY.score < 1000) {
        MY.scoreL.text = "00000" + MY.score + "0";
    } else if (MY.score < 10000) {
        MY.scoreL.text = "0000" + MY.score + "0";
    } else if (MY.score < 100000) {
        MY.scoreL.text = "000" + MY.score + "0";
    } else if (MY.score < 1000000) {
        MY.scoreL.text = "00" + MY.score + "0";
    } else if (MY.score < 10000000) {
        MY.scoreL.text = "0" + MY.score + "0";
    }
}

// 獲得勲章数を表示　
MY.showMedalCount = function() {
    if (!MY.mcount) {
        MY.mcount = new Label("" + MY.medalNum);
        MY.mcount.x = 30;
        MY.mcount.y = 344;
        MY.mcount.color = "white";
        MY.mcount.font = "8px Courier"
        MY.g.rootScene.addChild(MY.mcount);
    } else {
        MY.mcount.text = "" + MY.medalNum;
    }
}

// 死の始まり
MY.startDead = function() {
    MY.audio.eff07.play();
    MY.dead = new Object();
    MY.dead.sprite = new Sprite(48, 12);
    MY.dead.sprite.image = MY.g.assets["image/dead.png"];
    MY.dead.sprite.x = MY.bar.sprite.x;
    MY.dead.sprite.y = MY.bar.sprite.y;
    MY.dead.sprite.frame = [0, 1];
    MY.bar.sprite.remove();
    MY.bar = undefined;
    MY.dead.frame = 0;
    MY.g.rootScene.addChild(MY.dead.sprite);
}

// 勲章を追加
MY.addMedal = function(x, y) {
    var n = MY.medal.length;
    MY.medal[n] = new Object();
    MY.medal[n].vy = -8;
    MY.medal[n].sprite = new Sprite(24, 24);
    MY.medal[n].sprite.image = MY.g.assets["image/medal.png"];
    MY.medal[n].sprite.frame = [0, 0, 1, 1, 2, 2, 3, 3];
    MY.medal[n].sprite.x = x;
    MY.medal[n].sprite.y = y;
    MY.g.rootScene.addChild(MY.medal[n].sprite);
}

// 勲章獲得エフェクトを追加
MY.addBonus = function(x, y) {
    var n = MY.bonus.length;
    MY.bonus[n] = new Object();
    MY.bonus[n].vy = -10;
    MY.bonus[n].frame = 0;
    MY.bonus[n].sprite = new Sprite(24, 24);
    MY.bonus[n].sprite.image = MY.g.assets["image/bonus.png"];
    MY.bonus[n].sprite.frame = [0, 1, 2, 3];
    MY.bonus[n].sprite.x = x;
    MY.bonus[n].sprite.y = y;
    MY.g.rootScene.addChild(MY.bonus[n].sprite);
}

// 爆発エフェクトを発生
MY.addBomb = function(x, y, xs) {
    var n = MY.bomb.length;
    MY.bomb[n] = new Object();
    switch (xs) {
        case 12:
            MY.bomb[n].sprite = new Sprite(12, 12);
            MY.bomb[n].sprite.image = MY.g.assets["image/bomb0.png"];
            break;
        case 24:
            MY.bomb[n].sprite = new Sprite(24, 12);
            MY.bomb[n].sprite.image = MY.g.assets["image/bomb1.png"];
            break;
        case 36:
            MY.bomb[n].sprite = new Sprite(36, 12);
            MY.bomb[n].sprite.image = MY.g.assets["image/bomb2.png"];
            break;
    }
    MY.bomb[n].sprite.frame = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, null];
    MY.bomb[n].sprite.x = x;
    MY.bomb[n].sprite.y = y;
    MY.bomb[n].frame = 0;
    MY.g.rootScene.addChild(MY.bomb[n].sprite);
    MY.addMedal(x - (24 - xs) / 2, y - 6);
}

// サンダーを追加
MY.addThunder = function(x, y) {
    if (MY.ball && 0 < MY.ball.vy) return;
    if (!MY.thunder) {
        MY.thunder = new Object();
        MY.thunder.sprite = new Sprite(12, 12);
        MY.thunder.sprite.image = MY.g.assets["image/thunder.png"];
        MY.thunder.sprite.frame = [0, 0, 1, 1];
        MY.g.rootScene.addChild(MY.thunder.sprite);
    }
    MY.thunder.sprite.x = x;
    MY.thunder.sprite.y = y;
}

// 敵を破壊
MY.destructEnemy = function(i) {
    MY.magEff[MY.mag.val].play();
    MY.scoreA++;
    MY.scoreA += MY.medalNum;
    MY.addBomb(MY.enemy[i].sprite.x, MY.enemy[i].sprite.y, MY.enemy[i].xs);
    MY.mag.val++;
    if (16 < MY.mag.val) MY.mag.val = 16;
    MY.enemy[i].sprite.remove();
    var kind = MY.enemy[i].kind;
    MY.enemy[i] = undefined;
    MY.enemy.splice(i, 1);
    MY.enemyLeft--;
    var left = false;
    for (var j = 0; j < MY.enemy.length; j++) {
        if (kind == MY.enemy[j].kind) {
            left = true;
            break;
        }
    }
    if (!left) {
        MY.enemyAlive[kind] = false;
    }
}

// レーザー砲台を追加
MY.addLaser = function(x) {
    if (!MY.ball) return;
    var n = MY.laser.length;
    MY.laser[n] = new Object();
    MY.laser[n].sprite = new Sprite(36, 24);
    MY.laser[n].sprite.image = MY.g.assets["image/laser.png"];
    MY.laser[n].sprite.frame = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, null];
    MY.laser[n].sprite.x = x;
    MY.laser[n].sprite.y = 360;
    MY.laser[n].vy = -5;
    MY.laser[n].frame = 0;
    MY.laser[n].setup = false;
    MY.laser[n].width = 0;
    MY.g.rootScene.addChild(MY.laser[n].sprite);
}

// メインループ
MY.mainloop = function() {
    var n, i, j, nx, needUpdate;

    if (0 === MY.frame) {
		MY.copyright.x = (360 - MY.copyright._boundWidth) / 2;
		MY.pushSpace.x = (360 - MY.pushSpace._boundWidth) / 2;
        MY.frameT++;
        switch (MY.frameT % 20) {
            case 0: MY.pushSpace.visible = true; break;
            case 8: MY.pushSpace.visible = false; break;
        }
        if (MY.g.input.a) {
            MY.frame = 1;
            MY.title.remove();
            MY.copyright.remove();
            MY.pushSpace.remove();
        }
        return;
    } else {
        MY.frame++;
    }

    if (MY.gameover && 90 < MY.gameover.frame) {
        if (MY.gameover.label) {
            if (140 < MY.gameover.label.y) MY.gameover.label.y -= 2;
            else if (!MY.result) {
                MY.result = new Label("SCORE " + MY.score + "0 pts");
                MY.result.x = 360;
                MY.result.y = 176;
                MY.result.color = "white";
                MY.result.font = "16px Courier"
                MY.g.rootScene.addChild(MY.result);
            } else if (160 == MY.gameover.frame) {
                MY.result.remove();
                MY.gameover.label.remove();
                MY.score *= 10;
                MY.g.end(MY.score, "Your score is " + MY.score);
            } else MY.result.x = (360 - MY.result._boundWidth) / 2;
            MY.gameover.frame++;
        }
        return
    }

    if (MY.curtain) {
        if (2 == MY.frame) {
            for (i = 0; i < MY.curtain.length; i++) {
                MY.curtain[i].frame = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
            }
        } else if (19 == MY.frame) {
            for (i = 0; i < MY.curtain.length; i++) {
                MY.curtain[i].remove();
            }
            MY.curtain = undefined;
        }
    }

    // バーの処理
    if (MY.bar) {
        if (MY.g.input.left && 12 < MY.bar.sprite.x) {
            MY.bar.sprite.x -= 8;
            if (MY.bar.sprite.x < 12) MY.bar.sprite.x = 12;
            // READY中はボールを連動
            if (MY.ready) {
                MY.ball.vx = -5;
                MY.ball.sprite.x = MY.bar.sprite.x + 18;
            }
        } else if (MY.g.input.right && MY.bar.sprite.x < 300) {
            MY.bar.sprite.x += 8;
            if (300 < MY.bar.sprite.x) MY.bar.sprite.x = 300;
            // READY中はボールを連動
            if (MY.ready) {
                MY.ball.vx = 5;
                MY.ball.sprite.x = MY.bar.sprite.x + 18;
            }
        }
    } else if (MY.dead) {
        // 死亡アニメーション
        MY.dead.frame++;
        if (80 < MY.dead.frame) {
            MY.dead.sprite.remove();
            MY.dead = undefined;
        }
    }

    // ボールの移動
    if (MY.ball && !MY.ready) {
        MY.ball.sprite.x += MY.ball.vx;
        MY.ball.sprite.y += MY.ball.vy;
        if (MY.ball.sprite.x < 12) {
            MY.ball.sprite.x = 12;
            MY.ball.vx = -MY.ball.vx;
            MY.audio.eff01.play();
        } else if (336 < MY.ball.sprite.x) {
            MY.ball.sprite.x = 336;
            MY.ball.vx = -MY.ball.vx;
            MY.audio.eff01.play();
        }
        if (MY.ball.vy < 0 && MY.ball.sprite.y < 0) {
            MY.ball.sprite.y = 0;
            MY.ball.vy = -MY.ball.vy;
            MY.audio.eff01.play();
        }
        if (0 < MY.ball.vy && MY.bar) {
            // ボールとバーの当たり判定
            if (MY.bar.sprite.x < MY.ball.sprite.x + 12 &&
                    MY.ball.sprite.x < MY.bar.sprite.x + 48 &&
                    MY.bar.sprite.y < MY.ball.sprite.y + 12 &&
                    MY.ball.sprite.y < MY.bar.sprite.y + 8) {
                MY.ball.vy = -MY.ball.vy;
                MY.ball.vy -= 0.2;
                n = MY.ball.sprite.x + 6 - (MY.bar.sprite.x + 24);
                n /= 7.77;
                MY.ball.vx += n;
                if (MY.ball.vy < -8) MY.ball.vy = -8;
                if (10 < MY.ball.vx) MY.ball.vx = 10;
                else if (MY.ball.vx < -10) MY.ball.vx = -10;
                MY.mag.val = 0;
                MY.audio.eff01.play();
            }
        }
        if (360 < MY.ball.sprite.y) {
            MY.audio.eff13.play();
            MY.ball.sprite.remove();
            MY.ball = undefined;
        }
    }

    // 敵の処理
    if (0 < MY.enemy.length) {
        // 移動
        if (0 == MY.frame % MY.enemy.length) {
            // 移動対象の編隊を選定
            n = MY.enemyMove;
            while (!MY.enemyAlive[n]) {
                n++;
                if (MY.enemyAlive.length <= n) {
                    n = 0;
                }
            }
            MY.enemyMove = n + 1;
            if (MY.enemyAlive.length <= MY.enemyMove) {
                MY.enemyMove = 0;
            }
            MY.enemyEff[n].play();
            // 移動対象の編隊が左右へ移動可能かチェック
            var canMove = true;
            for (i = 0; i < MY.enemy.length; i++) {
                if (MY.enemy[i].kind != n) continue;
                if (MY.enemyVector < 0) {
                    nx = MY.enemy[i].sprite.x + MY.enemyVector;
                } else {
                    nx = MY.enemy[i].sprite.x + MY.enemy[i].xs + MY.enemyVector;
                }
                if (348 < nx || nx < 12) {
                    // 移動不可能なので全体を下へ移動して方向転換
                    MY.enemyVector = -MY.enemyVector;
                    for (i = 0; i < MY.enemy.length; i++) {
                        MY.enemy[i].sprite.y += 12;
                        MY.enemy[i].an = 1 - MY.enemy[i].an;
                        MY.enemy[i].sprite.frame = [MY.enemy[i].an];
                    }
                    canMove = false;
                    break;
                }
            }
            // 移動
            if (canMove) {
                for (i = 0; i < MY.enemy.length; i++) {
                    if (MY.enemy[i].kind == n) {
                        MY.enemy[i].sprite.x += MY.enemyVector;
                        MY.enemy[i].an = 1 - MY.enemy[i].an;
                        MY.enemy[i].sprite.frame = [MY.enemy[i].an];
                    }
                }
            }
        }
        // ボールとの当たり判定 & サンダーの発射判定
        if (MY.ball) {
            var needThunder = !MY.thunder && MY.bar && !MY.ready;
            for (i = 0; i < MY.enemy.length; i++) {
                // 単純接触判定
                if (MY.enemy[i].sprite.x < MY.ball.sprite.x + 12 &&
                    MY.ball.sprite.x < MY.enemy[i].sprite.x + MY.enemy[i].xs &&
                    MY.enemy[i].sprite.y < MY.ball.sprite.y + 12 &&
                    MY.ball.sprite.y < MY.enemy[i].sprite.y + MY.enemy[i].ys
                ) {
                    // 左右 or 上下のどちらに衝突したのか判定
                    if (MY.enemy[i].sprite.x < MY.ball.sprite.x + 12 &&
                        MY.ball.sprite.x < MY.enemy[i].sprite.x &&
                        MY.enemy[i].sprite.y + MY.enemy[i].ys / 2 < MY.ball.sprite.y + 12 &&
                        MY.ball.sprite.y < MY.enemy[i].sprite.y + MY.enemy[i].ys / 2
                    ) {
                        MY.destructEnemy(i);
                        MY.ball.vx = -MY.ball.vx;
                        i--;
                    } else if (MY.enemy[i].sprite.x + MY.enemy[i].sprite.xs < MY.ball.sprite.x + 12 &&
                        MY.ball.sprite.x < MY.enemy[i].sprite.x + MY.enemy[i].sprite.xs  &&
                        MY.enemy[i].sprite.y + MY.enemy[i].ys / 2 < MY.ball.sprite.y + 12 &&
                        MY.ball.sprite.y < MY.enemy[i].sprite.y + MY.enemy[i].ys / 2
                    ) {
                        MY.destructEnemy(i);
                        MY.ball.vx = -MY.ball.vx;
                        i--;
                    } else {
                        MY.destructEnemy(i);
                        MY.ball.vy = -MY.ball.vy;
                        i--;
                    }
                } else if (needThunder) {
                    // サンダー
                    if (MY.enemy[i].sprite.x < MY.bar.sprite.x + 40 &&
                        MY.bar.sprite.x + 8 < MY.enemy[i].sprite.x + MY.enemy[i].xs
                    ) {
                        MY.addThunder(MY.enemy[i].sprite.x + (MY.enemy[i].xs - 12) / 2, MY.enemy[i].sprite.y + 12);
                    }
                }
            }
        }
    }

    // サンダー
    if (MY.thunder) {
        MY.thunder.sprite.y += 4;
        if (360 < MY.thunder.sprite.y) {
            MY.thunder.sprite.remove();
            MY.thunder = undefined;
        }　else {
            // サン x ボー & サン x バー のチェック
            if (MY.ball &&
                MY.thunder.sprite.x + 2 < MY.ball.sprite.x + 10 &&
                MY.ball.sprite.x + 2 < MY.thunder.sprite.x + 10 &&
                MY.thunder.sprite.y + 2 < MY.ball.sprite.y + 10 &&
                MY.ball.sprite.y + 2 < MY.thunder.sprite.y + 10
            ) {
                MY.addBomb(MY.thunder.sprite.x, MY.thunder.sprite.y, 12);
                MY.thunder.sprite.remove();
                MY.thunder = undefined;
                MY.ball.vx = -MY.ball.vx;
                MY.ball.vy = -MY.ball.vy;
                MY.audio.eff06.play();
            } else if (MY.bar &&
                MY.thunder.sprite.x < MY.bar.sprite.x + 48 &&
                MY.bar.sprite.x < MY.thunder.sprite.x + 12 &&
                MY.thunder.sprite.y < MY.bar.sprite.y + 4 &&
                MY.bar.sprite.y + 4 < MY.thunder.sprite.y + 12
            ) {
                MY.addBomb(MY.thunder.sprite.x, MY.thunder.sprite.y, 12);
                MY.thunder.sprite.remove();
                MY.thunder = undefined;
                MY.startDead();
            }
        }
    }

    // ネオアームストロングサイクロンジェットアームストロング砲 (※完成度はそれなり)
    for (i = 0; i < MY.laser.length; i++) {
        MY.laser[i].frame++;
        // レーザーとの当たり判定
        if (MY.laser[i].sprite3) {
            // 当たった敵は死ぬ!!
            for (j = 0; j < MY.enemy.length; j++) {
                if (MY.enemy[j].sprite.x < MY.laser[i].sprite3.x + 5 &&
                    MY.laser[i].sprite3.x + 3 < MY.enemy[j].sprite.x + MY.enemy[j].xs) {
                    MY.destructEnemy(j);
                    j--;
                }
            }
            // リアルでハードコアなレーザーなので自分も死ぬ
            if (MY.bar && MY.bar.sprite.x < MY.laser[i].sprite3.x + 5 &&
                MY.laser[i].sprite3.x + 3 < MY.bar.sprite.x + 48) {
                MY.startDead();
            }
            // ボールは跳ね返る（なぜか勲章付き）
            if (MY.ball && MY.ball.sprite.x < MY.laser[i].sprite3.x + 5 &&
                MY.laser[i].sprite3.x + 3 < MY.ball.sprite.x + 12) {
                MY.ball.vx = -MY.ball.vx;
                MY.audio.eff06.play();
                MY.addMedal(MY.ball.sprite.x - 6, MY.ball.sprite.y - 6);
                if (MY.ball.vx < 0) {
                    MY.ball.sprite.x = MY.laser[i].sprite3.x + 3 - 12;
                } else {
                    MY.ball.sprite.x = MY.laser[i].sprite3.x + 5;
                }
            }
        }
        // ザックリと言えばレーザー制御処理
        if (338 < MY.laser[i].sprite.y) {
            MY.laser[i].sprite.y += MY.laser[i].vy;
            MY.laser[i].vy += 0.2;
            if (MY.laser[i].sprite.y <= 338) {
                MY.laser[i].sprite.y = 338;
                if (!MY.laser[i].setup) {
                    MY.laser[i].setup = true;
                    MY.audio.lsetup.play();
                }
            }
        }
        if (80 == MY.laser[i].frame) {
            MY.laser[i].sprite3 = new Sprite(16, 338);
            MY.laser[i].sprite3.image = MY.g.assets["image/laser2.png"];
            MY.laser[i].sprite3.frame = [
                0, 0, 0, 0, 1, 1, 1, 1,
                2, 2, 2, 2, 3, 3, 3, 3,
                4, 4, 4, 4, 5, 5, 5, 5,
                4, 4, 4, 3, 3, 3, 2, 2,
                2, 1, 1, 1, 0, 0, 0, null];
            MY.laser[i].sprite3.x = MY.laser[i].sprite.x + 10;
            MY.laser[i].sprite3.y = 0;
            MY.g.rootScene.addChild(MY.laser[i].sprite3);
            MY.laser[i].sprite2 = new Sprite(32, 32);
            MY.laser[i].sprite2.image = MY.g.assets["image/explosion.png"];
            MY.laser[i].sprite2.x = MY.laser[i].sprite.x + 2;
            MY.laser[i].sprite2.y = MY.laser[i].sprite.y - 16;
            MY.laser[i].sprite2.frame = [0, 0, 1, 1, 2, 2, 3, 3];
            MY.g.rootScene.addChild(MY.laser[i].sprite2);
            MY.audio.fire.play();
        } else if (120 == MY.laser[i].frame) {
            MY.laser[i].sprite2.remove();
            MY.laser[i].sprite3.remove();
            MY.laser[i].sprite2 = undefined;
            MY.laser[i].sprite3 = undefined;
        } else if (120 < MY.laser[i].frame) {
            MY.laser[i].sprite.y++;
            if (360 < MY.laser[i].sprite.y) {
                MY.laser[i].sprite.remove();
                MY.laser[i].sprite = undefined;
                MY.laser.splice(i, 1);
                i--;
            }
        }
    }

    // 勲章
    needUpdate = false;
    for (i = 0; i < MY.medal.length; i++) {
        MY.medal[i].vy += 0.5;
        MY.medal[i].sprite.y += MY.medal[i].vy;
        if (360 < MY.medal[i].sprite.y) {
            MY.medal[i].sprite.remove();
            MY.medal[i] = undefined;
            MY.medal.splice(i, 1);
            i--;
        } else {
            if (MY.bar &&
                MY.medal[i].sprite.x < MY.bar.sprite.x + 48 &&
                MY.bar.sprite.x < MY.medal[i].sprite.x + 24 &&
                MY.medal[i].sprite.y < MY.bar.sprite.y + 8 &&
                MY.bar.sprite.y < MY.medal[i].sprite.y + 24
            ) {
                if (!needUpdate) MY.audio.eff00.play();
                MY.addBonus(MY.medal[i].sprite.x, MY.medal[i].sprite.y);
                MY.medal[i].sprite.remove();
                MY.medal[i] = undefined;
                MY.medal.splice(i, 1);
                i--;
                MY.medalNum++;
                needUpdate = true;
                if (MY.laserWait != 0) {
                    MY.laserWait--;
                } else {
                    MY.addLaser(MY.bar.sprite.x + 6);
                    MY.laserWait = MY.enemy.length / 2;
                    if (8 < MY.laserWait) MY.laserWait = 8;
                    if (MY.laserWait < 3) MY.laserWait = 3;
                }
            }
        }
    }
    if (needUpdate) {
        MY.showMedalCount();
    }

    // 勲章獲得エフェクト
    for (i = 0; i < MY.bonus.length; i++) {
        MY.bonus[i].sprite.y += MY.bonus[i].vy;
        if (-0.5 != MY.bonus[i].vy) {
            MY.bonus[i].vy += 0.5;
            if (-0.5 < MY.bonus[i].vy) {
                MY.bonus[i].vy = 0.5;
            }
        }
        MY.bonus[i].frame++;
        if (20 < MY.bonus[i].frame) {
            MY.bonus[i].sprite.remove();
            MY.bonus[i] = undefined;
            MY.bonus.splice(i, 1);
            i--;
        }
    }

    // 爆発エフェクト
    for (i = 0; i < MY.bomb.length; i++) {
        MY.bomb[i].frame++;
        if(16 == MY.bomb[i].frame) {
            MY.bomb[i].sprite.remove();
            MY.bomb[i] = undefined;
            MY.bomb.splice(i, 1);
            i--;
        }
    }

    // 倍率ゲージの表示
    for (i = 0; i < MY.mag.val; i++) {
        MY.gauge[i].visible = true;
    }
    for (; i < 16; i++) {
        MY.gauge[i].visible = false;
    }

    // スコア表示
    if (0 != MY.scoreA) {
        MY.showScore();
    }

    // READY終了チェック
    if (MY.ready) {
        MY.ready--;
        MY.getReady.x = (360 - MY.getReady._boundWidth) / 2;
        switch (MY.ready % 20) {
            case 0: MY.getReady.visible = true; break;
            case 8: MY.getReady.visible = false; break;
        }
        if (MY.ready < 1) {
            MY.ready = undefined;
            MY.getReady.remove();
        }
    }

    // ゲームオーバー判定
    if (!MY.gameover) {
        // レーザー & 勲章 が無い
        if (0 == MY.medal.length && 0 == MY.laser.length) {
            // 敵が全滅している or タマが落ちている or バーが破壊されている
            if (0 == MY.enemy.length || !MY.ball || !MY.bar) {
                MY.gameover = new Object();
                MY.gameover.frame = 0;
                MY.gameover.label = new Label("GAME OVER");
                MY.gameover.label.x = 360;
                MY.gameover.label.y = (360 - 24) / 2;
                MY.gameover.label.color = "white";
                MY.gameover.label.font = "24px Courier"
                MY.g.rootScene.addChild(MY.gameover.label);
            }
        }
    } else {
        MY.gameover.label.x = (360 - MY.gameover.label._boundWidth) / 2;
        MY.gameover.frame++;
        if (50 == MY.gameover.frame) {
            // 暗幕を準備
            MY.curtain2 = new Array(100);
            for (n = 0, i = 0; i < 10; i++) {
                for (j = 0; j < 10; j++, n++) {
                    MY.curtain2[n] = new Sprite(36, 36);
                    MY.curtain2[n].image = MY.g.assets["image/curtain.png"];
                    MY.curtain2[n].frame = [
                        15, 15, 14, 14, 13, 13, 12, 12, 11, 11, 10, 10, 9, 9, 8, 8,
                        7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, null
                        ];
                    MY.curtain2[n].x = i * 36;
                    MY.curtain2[n].y = j * 36;
                    MY.g.rootScene.addChild(MY.curtain2[n]);
                }
            }
            MY.g.rootScene.insertBefore(MY.gameover.label, MY.curtain2[99]);
        }
    }
}

onload = function() {
    window.focus();
    enchant();
    MY.g = new Game(360, 360);
    MY.g.fps = 30;
    MY.g.preload([
        "image/bg.png",
        "image/bar.png",
        "image/ball.png",
        "image/enemy0.png",
        "image/enemy1.png",
        "image/enemy2.png",
        "image/bomb0.png",
        "image/bomb1.png",
        "image/bomb2.png",
        "image/medal.png",
        "image/medal2.png",
        "image/bonus.png",
        "image/thunder.png",
        "image/dead.png",
        "image/laser.png",
        "image/laser2.png",
        "image/explosion.png",
        "image/gauge.png",
        "image/curtain.png",
        "image/iblock.png",
        "audio/hit0.ogg",
        "audio/hit1.ogg",
        "audio/hit2.ogg",
        "audio/hit3.ogg",
        "audio/hit4.ogg",
        "audio/lsetup.ogg",
        "audio/fire.ogg",
        "audio/eff00.ogg",
        "audio/eff01.ogg",
        "audio/eff02.ogg",
        "audio/eff03.ogg",
        "audio/eff04.ogg",
        "audio/eff05.ogg",
        "audio/eff06.ogg",
        "audio/eff07.ogg",
        "audio/eff13.ogg"
    ]);
    MY.g.onload = function() {
        // オーディオを準備
        MY.audio = new Object();
        MY.audio.eff00 = MY.g.assets['audio/eff00.ogg'].clone();
        MY.audio.eff01 = MY.g.assets['audio/eff01.ogg'].clone();
        MY.audio.eff06 = MY.g.assets['audio/eff06.ogg'].clone();
        MY.audio.eff07 = MY.g.assets['audio/eff07.ogg'].clone();
        MY.audio.eff13 = MY.g.assets['audio/eff13.ogg'].clone();
        MY.audio.lsetup = MY.g.assets['audio/lsetup.ogg'].clone();
        MY.audio.fire = MY.g.assets['audio/fire.ogg'].clone();

        // BGを準備
        MY.bg = new Sprite(360, 360);
        MY.bg.image = MY.g.assets["image/bg.png"];
        MY.bg.x = 0;
        MY.bg.y = 0;
        MY.g.rootScene.addChild(MY.bg);

        // バーを準備
        MY.bar = new Object();
        MY.bar.sprite = new Sprite(48, 12);
        MY.bar.sprite.image = MY.g.assets["image/bar.png"];
        MY.bar.sprite.x = 156;
        MY.bar.sprite.y = 320;
        MY.g.rootScene.addChild(MY.bar.sprite);

        // ボールを準備
        MY.ball = new Object();
        MY.ball.sprite = new Sprite(12, 12);
        MY.ball.sprite.image = MY.g.assets["image/ball.png"];
        MY.ball.sprite.x = MY.bar.sprite.x + 18;
        MY.ball.sprite.y = MY.bar.sprite.y - 12;
        MY.ready = 100;
        MY.ball.vx = 5;
        MY.ball.vy = -6;
        MY.g.rootScene.addChild(MY.ball.sprite);

        // 敵の準備
        MY.enemy = new Array();
        MY.enemyMove = 0;
        MY.enemyVector = 12; // 敵の移動方向
        MY.enemyAlive = [true, true, true, true]; // 編隊毎の生存フラグ
        MY.enemyEff = [
            MY.g.assets['audio/eff02.ogg'].clone(),
            MY.g.assets['audio/eff03.ogg'].clone(),
            MY.g.assets['audio/eff04.ogg'].clone(),
            MY.g.assets['audio/eff05.ogg'].clone()
        ];
        var an = 0, i, j, n;

        // 敵 - 編隊1
        for (j = 0; j < 2; j++) {
            for (i = 0; i < 19; i++) {
                n = MY.enemy.length;
                MY.enemy[n] = new Object();
                MY.enemy[n].kind = 0;
                MY.enemy[n].xs = 12;
                MY.enemy[n].ys = 12;
                MY.enemy[n].an = an;
                MY.enemy[n].sprite = new Sprite(12, 12);
                MY.enemy[n].sprite.image = MY.g.assets["image/enemy0.png"]
                MY.enemy[n].sprite.frame = [an];
                an = 1 - an;
                MY.enemy[n].sprite.x = 24 + i * 16;
                MY.enemy[n].sprite.y = 25 + j * 16;
                MY.g.rootScene.addChild(MY.enemy[n].sprite);
            }
        }

        // 敵 - 編隊2, 3
        for (j = 2; j < 5; j++) {
            for (i = 0; i < 11; i++) {
                n = MY.enemy.length;
                MY.enemy[n] = new Object();
                MY.enemy[n].kind = 1 + (j == 4 ? 1 : 0);
                MY.enemy[n].xs = 24;
                MY.enemy[n].ys = 12;
                MY.enemy[n].an = an;
                MY.enemy[n].sprite = new Sprite(24, 12);
                MY.enemy[n].sprite.image = MY.g.assets["image/enemy1.png"]
                MY.enemy[n].sprite.frame = [an];
                an = 1 - an;
                MY.enemy[n].sprite.x = 20 + i * 28;
                MY.enemy[n].sprite.y = 25 + j * 16;
                MY.g.rootScene.addChild(MY.enemy[n].sprite);
            }
        }

        // 敵 - 編隊3, 4
        for (j = 5; j < 8; j++) {
            for (i = 0; i < 8; i++) {
                n = MY.enemy.length;
                MY.enemy[n] = new Object();
                MY.enemy[n].kind = 2 + (j == 5 ? 0 : 1);
                MY.enemy[n].xs = 36;
                MY.enemy[n].ys = 12;
                MY.enemy[n].an = an;
                MY.enemy[n].sprite = new Sprite(36, 12);
                MY.enemy[n].sprite.image = MY.g.assets["image/enemy2.png"]
                MY.enemy[n].sprite.frame = [an];
                an = 1 - an;
                MY.enemy[n].sprite.x = 22 + i * 38;
                MY.enemy[n].sprite.y = 25 + j * 16;
                MY.g.rootScene.addChild(MY.enemy[n].sprite);
            }
        }

        // 倍率
        MY.mag = new Object();
        MY.mag.val = 0;
        var hit0 = MY.g.assets['audio/hit0.ogg'].clone()
        var hit1 = MY.g.assets['audio/hit1.ogg'].clone()
        var hit2 = MY.g.assets['audio/hit2.ogg'].clone()
        var hit3 = MY.g.assets['audio/hit3.ogg'].clone()
        var hit4 = MY.g.assets['audio/hit4.ogg'].clone()
        MY.magEff = [
            hit0, hit1, hit2, hit3,
            hit2, hit1, hit0, hit1,
            hit2, hit3, hit2, hit1,
            hit0, hit1, hit2, hit4,
            hit4];

        // 勲章カウンタ
        var mcountA = new Sprite(12, 12);
        mcountA.image = MY.g.assets["image/medal2.png"];
        mcountA.frame = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3];
        mcountA.x = 16;
        mcountA.y = 344;
        MY.g.rootScene.addChild(mcountA);
        MY.medalNum = 0;
        MY.mcount = undefined;
        MY.showMedalCount();

        // スコア
        var scoreL = new Label("SCORE");
        scoreL.x = 16;
        scoreL.y = 4;
        scoreL.color = "white";
        scoreL.font = "16px Courier"
        MY.g.rootScene.addChild(scoreL);
        MY.score = 0;
        MY.scoreA = 0;
        MY.showScore();

        // GET READY
        MY.getReady = new Label("GET READY");
		MY.getReady.x = 168;
		MY.getReady.y = 180;
        MY.getReady.color = "white";
        MY.getReady.font = "16px Courier"
        MY.g.rootScene.addChild(MY.getReady);

        // 倍率ゲージ
        MY.gauge = new Array(16);
        for (i = 0; i < 16; i++) {
            MY.gauge[i] = new Sprite(8, 8);
            MY.gauge[i].image = MY.g.assets["image/gauge.png"];
            MY.gauge[i].frame = [i];
            MY.gauge[i].x = 338 - i * 10;
            MY.gauge[i].y = 348;
            MY.gauge[i].visible = false;
            MY.g.rootScene.addChild(MY.gauge[i]);
        }

        // 暗幕
        MY.curtain = new Array(100);
        for (n = 0, i = 0; i < 10; i++) {
            for (j = 0; j < 10; j++, n++) {
                MY.curtain[n] = new Sprite(36, 36);
                MY.curtain[n].image = MY.g.assets["image/curtain.png"];
                MY.curtain[n].frame = [0];
                MY.curtain[n].x = i * 36;
                MY.curtain[n].y = j * 36;
                MY.g.rootScene.addChild(MY.curtain[n]);
            }
        }

        // タイトル
        MY.title = new Sprite(340, 60);
        MY.title.image = MY.g.assets["image/iblock.png"];
        MY.title.x = 10;
        MY.title.y = 64;
        MY.g.rootScene.addChild(MY.title);

        // copyright
        MY.copyright = new Label("Copyright(C)2016, SUZUKI PLAN.");
		MY.copyright.y = 320;
        MY.copyright.color = "white";
        MY.copyright.font = "18px Courier"
        MY.g.rootScene.addChild(MY.copyright);

        // pushSpace
        MY.pushSpace = new Label("PUSH [Z] KEY");
		MY.pushSpace.y = 208;
        MY.pushSpace.color = "white";
        MY.pushSpace.font = "20px Courier"
        MY.g.rootScene.addChild(MY.pushSpace);

		MY.copyright.x = (360 - MY.copyright._boundWidth) / 2;
		MY.pushSpace.x = (360 - MY.pushSpace._boundWidth) / 2;

        // [space]キー, [z]キー を aボタン として割り当てる
        MY.g.keybind(' '.charCodeAt(0), 'a');
        MY.g.keybind('z'.charCodeAt(0), 'a');
        MY.g.keybind('Z'.charCodeAt(0), 'a');

        // 他
        MY.dead = undefined;
        MY.thunder = undefined;
        MY.bomb = new Array();
        MY.medal = new Array();
        MY.bonus = new Array();
        MY.laser = new Array(); // ネオアームストロングサイクロンジェットアームストロング砲 (※完成度はそこそこ)
        MY.laserWait = 8;
        MY.frame = 0;
        MY.frameT = 0;
        MY.gameover = undefined;
        MY.curtain2 = undefined;
        MY.result = undefined;

        MY.g.rootScene.addEventListener(Event.ENTER_FRAME, MY.mainloop);
    }
    MY.g.start();
};
