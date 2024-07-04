'use client';

import { useEffect } from 'react';
import p5 from 'p5';

const Sketch = () => {
	useEffect(() => {
		const sketch = (p) => {
			let shapeType = 'circle';
			let shapeColor;
			let shapeSize = 50;
			let color1, color2, lerpValue;
			let angle = 0;
			let particles = [];

			p.setup = () => {
				p.createCanvas(p.windowWidth, p.windowHeight).parent('p5-background');
				shapeColor = p.color(0);
				changeColors();
				lerpValue = 0;
				setInterval(changeColors, 3000);
			};

			p.draw = () => {
				setGradient(0, 0, p.width, p.height, color1, color2, lerpValue);
				lerpValue += 0.01;
				if (lerpValue > 1) lerpValue = 0;

				for (let i = particles.length - 1; i >= 0; i--) {
					particles[i].update();
					particles[i].show();
					if (particles[i].finished()) {
						particles.splice(i, 1);
					}
				}

				let x = p.constrain(p.mouseX, shapeSize / 2, p.width - shapeSize / 2);
				let y = p.constrain(p.mouseY, shapeSize / 2, p.height - shapeSize / 2);

				p.fill(shapeColor);
				p.noStroke();

				p.push();
				p.translate(x, y);
				p.rotate(angle);
				if (shapeType === 'circle') {
					p.ellipse(0, 0, shapeSize, shapeSize);
				} else if (shapeType === 'rectangle') {
					p.rect(-shapeSize / 2, -shapeSize / 2, shapeSize, shapeSize);
				} else if (shapeType === 'triangle') {
					p.triangle(
						0,
						-shapeSize / 2,
						-shapeSize / 2,
						shapeSize / 2,
						shapeSize / 2,
						shapeSize / 2
					);
				}
				p.pop();

				angle += 0.05;

				particles.push(new Particle(p, p.random(p.width), p.random(p.height)));
			};

			const changeColors = () => {
				color1 = p.color(p.random(255), p.random(255), p.random(255));
				color2 = p.color(p.random(255), p.random(255), p.random(255));
			};

			const setGradient = (x, y, w, h, c1, c2, amt) => {
				let interA = p.lerpColor(c1, c2, amt);
				let interB = p.lerpColor(c2, c1, amt);
				for (let i = y; i <= y + h; i++) {
					let inter = p.lerpColor(interA, interB, p.map(i, y, y + h, 0, 1));
					p.stroke(inter);
					p.line(x, i, x + w, i);
				}
			};

			class Particle {
				constructor(p, x, y) {
					this.p = p;
					this.x = x;
					this.y = y;
					this.alpha = 255;
					this.color1 = p.color(p.random(255), p.random(255), p.random(255));
					this.color2 = p.color(p.random(255), p.random(255), p.random(255));
					this.gradientValue = 0;
				}

				finished() {
					return this.alpha < 0;
				}

				update() {
					this.y += this.p.random(-1, 1);
					this.x += this.p.random(-1, 1);
					this.alpha -= 1;
					this.gradientValue += 0.02;
					if (this.gradientValue > 1) this.gradientValue = 0;
				}

				show() {
					let interColor = this.p.lerpColor(
						this.color1,
						this.color2,
						this.gradientValue
					);
					this.p.noStroke();
					this.p.fill(
						this.p.red(interColor),
						this.p.green(interColor),
						this.p.blue(interColor),
						this.alpha
					);
					this.p.ellipse(this.x, this.y, 16);
				}
			}
		};

		const p5Instance = new p5(sketch);

		return () => {
			p5Instance.remove();
		};
	}, []);

	return (
		<div
			id="p5-background"
			style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}
		/>
	);
};

export default Sketch;
