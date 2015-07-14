function GlModel(gl, _color, _position, name, offset, code, x, y,
				lines, lineColor, 
				triangles, triangleColor, gradient) 
{
	x = typeof x !== 'undefined' ? x : 0.0;
	y = typeof y !== 'undefined' ? y : 0.0;
	offset = typeof offset !== 'undefined' ? offset : [0.0, 0.0, 0.0];
	lines = typeof lines !== 'undefined' ? lines : true;
	lineColor = typeof lineColor !== 'undefined' ? lineColor : [0.0, 0.0, 0.0, 0.5];
	triangles = typeof triangles !== 'undefined' ? triangles : true;
	triangleColor = typeof triangleColor !== 'undefined' ? triangleColor : [1.0,  1.0,  1.0, 0.1];
	gradient = typeof gradient !== 'undefined' ? gradient : false;
	code = typeof code !== 'undefined' ? code : 0;
	
	var loadQueue = 0; // is non-zero if something is loading
	this._bufferReady = false;
	
	this._gl = gl;
	this._color = _color;
	this._position = _position;
	
	this.selected = false;
	selectedLineColor = [0.0, 0.0, 0.0, 1.0];
	selectedTriangleColor = [1.0, 1.0, 1.0, 1.0];
	
	this._init = function() {
		
		if (lines) {
			var AjaxLine;
			var self = this;
			AjaxLine = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			AjaxLine.onreadystatechange = function(){
				if(AjaxLine.readyState == 4 /*&& AjaxLine.status == 200*/)
				{
					//Parse Model Data
					var Script = AjaxLine.responseText.split("\n");
			
					var Vertices = [];
					var OffsetVertices = [];
					var Elements = [];
					var Colors = [];
					var SelectedColors = [];
				
					for(var I in Script)
					{
						var Line = Script[I];
						//If Vertice Line
						if(Line.substring(0,2) == "v ")
						{
							var Row = Line.substring(2).split(" ");
							Vertices.push(parseFloat(Row[0])+ x);
							Vertices.push(parseFloat(Row[1])+ y);
							Vertices.push(parseFloat(Row[2]));
							OffsetVertices.push(parseFloat(Row[0])+ x + offset[0]);
							OffsetVertices.push(parseFloat(Row[1])+ y + offset[1]);
							OffsetVertices.push(parseFloat(Row[2]) + offset[2]);
						}
					}
					
					for (var i = 0; i < Vertices.length/3; i++) {
						Elements.push(i);
					}
					
					for (var i = 0; i < Vertices.length/3; i++) {
						Colors = Colors.concat(lineColor);
						SelectedColors = SelectedColors.concat(selectedLineColor);
					}
			
					self._line = new Object();
					self._line.vertices = Vertices;
					self._line.offsetVertices = OffsetVertices;
					self._line.elements = Elements;
					self._line.colors = Colors;
					self._line.selectedColors = SelectedColors;
			
					//Return The Arrays
					loadQueue--;
				}
			}
			loadQueue++;
			AjaxLine.open("GET", "obj/" + name + "-lines.obj", true);
			AjaxLine.url = name;
			AjaxLine.send();
		}
	
		if (triangles) {
			var Ajax;
			var self = this;
			Ajax = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			Ajax.onreadystatechange = function(){
				if(Ajax.readyState == 4 /*&& Ajax.status == 200*/)
				{
					//Parse Model Data
					var Script = Ajax.responseText.split("\n");
			
					var Vertices = [];
					var OffsetVertices = [];
					var Elements = [];
					var Colors = [];
					var CodedColors = [];
					var SelectedColors = [];
			
					for(var I in Script)
					{
						var Line = Script[I];
						//If Vertice Line
						if(Line.substring(0,2) == "v ")
						{
							var Row = Line.substring(2).split(" ");
							Vertices.push(parseFloat(Row[0]) + x);
							Vertices.push(parseFloat(Row[1]) + y);
							Vertices.push(parseFloat(Row[2]));
							OffsetVertices.push(parseFloat(Row[0])+ x + offset[0]);
							OffsetVertices.push(parseFloat(Row[1])+ y + offset[1]);
							OffsetVertices.push(parseFloat(Row[2]) + offset[2]);
						}
						else if(Line.substring(0,2) == "f ")
						{
							var Row = Line.substring(2).split(" ");
							if (Row.length === 3) {
								Elements.push(parseInt(Row[0])-1);
								Elements.push(parseInt(Row[1])-1);
								Elements.push(parseInt(Row[2])-1);
							} else if (Row.length === 4) {
								Elements.push(parseInt(Row[0])-1);
								Elements.push(parseInt(Row[1])-1);
								Elements.push(parseInt(Row[2])-1);
								Elements.push(parseInt(Row[0])-1);
								Elements.push(parseInt(Row[2])-1);
								Elements.push(parseInt(Row[3])-1);
							} else {
								console.log("Error: Row has " +Row.length+" entries!");
							}
						}
					}
					
					var codedColor = [code/255.0, 1.0, 1.0, 1.0];
					for (var i = 0; i < Vertices.length/3; i++) {
						Colors = Colors.concat(triangleColor);
						CodedColors = CodedColors.concat(codedColor);
						SelectedColors = SelectedColors.concat(selectedTriangleColor);
						if (gradient && (Vertices[i*3+2] === 0)) {
							Colors[Colors.length - 1] = 0.0;
						}
							
					}
					
					self._triangle = new Object();
					self._triangle.vertices = Vertices;
					self._triangle.offsetVertices = OffsetVertices;
					self._triangle.elements = Elements;
					self._triangle.colors = Colors;
					self._triangle.codedColors = CodedColors;
					self._triangle.selectedColors = SelectedColors;
					
					//Return The Arrays
					loadQueue--;
				}
			}
			loadQueue++;
			Ajax.open("GET", "obj/" + name + "-triangles.obj", true);
			Ajax.send();
		}
		
	}
	this._initBuffers = function() {
		if (this._line != undefined) {
			this._line.vertex_buffer = this._gl.createBuffer();
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._line.vertex_buffer);
			this._gl.bufferData(this._gl.ARRAY_BUFFER,
						new Float32Array(this._line.vertices),
						this._gl.STATIC_DRAW);

			this._line.offset_vertex_buffer = this._gl.createBuffer();
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._line.offset_vertex_buffer);
			this._gl.bufferData(this._gl.ARRAY_BUFFER,
						new Float32Array(this._line.offsetVertices),
						this._gl.STATIC_DRAW);
			
			this._line.element_buffer = this._gl.createBuffer();
			this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._line.element_buffer);
			this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER,
						new Uint16Array(this._line.elements),
						this._gl.STATIC_DRAW);
			
			this._line.color_buffer = this._gl.createBuffer();
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._line.color_buffer);
			this._gl.bufferData(this._gl.ARRAY_BUFFER, 
						new Float32Array(this._line.colors), 
						this._gl.STATIC_DRAW);
						
			this._line.selected_color_buffer = this._gl.createBuffer();
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._line.selected_color_buffer);
			this._gl.bufferData(this._gl.ARRAY_BUFFER, 
						new Float32Array(this._line.selectedColors), 
						this._gl.STATIC_DRAW);
			
		}
		if (this._triangle != undefined) {
			this._triangle.vertex_buffer = this._gl.createBuffer();
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.vertex_buffer);
			this._gl.bufferData(this._gl.ARRAY_BUFFER,
						new Float32Array(this._triangle.vertices),
						this._gl.STATIC_DRAW);
			
			this._triangle.offset_vertex_buffer = this._gl.createBuffer();
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.offset_vertex_buffer);
			this._gl.bufferData(this._gl.ARRAY_BUFFER,
						new Float32Array(this._triangle.offsetVertices),
						this._gl.STATIC_DRAW);

			this._triangle.element_buffer = this._gl.createBuffer();
			this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._triangle.element_buffer);
			this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER,
						new Uint16Array(this._triangle.elements),
						this._gl.STATIC_DRAW);
			
			this._triangle.color_buffer = this._gl.createBuffer();
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.color_buffer);
			this._gl.bufferData(this._gl.ARRAY_BUFFER, 
						new Float32Array(this._triangle.colors), 
						this._gl.STATIC_DRAW);

			this._triangle.selected_color_buffer = this._gl.createBuffer();
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.selected_color_buffer);
			this._gl.bufferData(this._gl.ARRAY_BUFFER, 
						new Float32Array(this._triangle.selectedColors), 
						this._gl.STATIC_DRAW);

			this._triangle.coded_color_buffer = this._gl.createBuffer();
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.coded_color_buffer);
			this._gl.bufferData(this._gl.ARRAY_BUFFER, 
						new Float32Array(this._triangle.codedColors), 
						this._gl.STATIC_DRAW);
		}
		this._bufferReady = true;
	}
	
	this._init();
	
	this.draw = function(useOffset) {
		if (loadQueue != 0) return;
		if (!this._bufferReady) this._initBuffers(gl);
		
		if (this._triangle !== undefined) {
			if (this.selected) {
				this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.selected_color_buffer);
				this._gl.vertexAttribPointer(this._color, 4, this._gl.FLOAT, false,0,0);
			}
			else {
				this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.color_buffer);
				this._gl.vertexAttribPointer(this._color, 4, this._gl.FLOAT, false,0,0);
			}
			
			if (useOffset === true) {
			    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.offset_vertex_buffer);
			    this._gl.vertexAttribPointer(this._position, 3, this._gl.FLOAT, false,0,0) ;
			} else {
			    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.vertex_buffer);
			    this._gl.vertexAttribPointer(this._position, 3, this._gl.FLOAT, false,0,0) ;
			}
		    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._triangle.element_buffer);
		    this._gl.drawElements(this._gl.TRIANGLES, this._triangle.elements.length, this._gl.UNSIGNED_SHORT, 0);
			
		}
		if (this._line !== undefined) {
			if (this.selected) {
				this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._line.selected_color_buffer);
				this._gl.vertexAttribPointer(this._color, 4, this._gl.FLOAT, false,0,0);
			}
			else {
				this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._line.color_buffer);
				this._gl.vertexAttribPointer(this._color, 4, this._gl.FLOAT, false,0,0);
			}
			if (useOffset === true) {
			    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._line.offset_vertex_buffer);
			    this._gl.vertexAttribPointer(this._position, 3, this._gl.FLOAT, false,0,0) ;
			} else {
			    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._line.vertex_buffer);
			    this._gl.vertexAttribPointer(this._position, 3, this._gl.FLOAT, false,0,0) ;
			}
		    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._line.element_buffer);
		    this._gl.drawElements(this._gl.LINES, this._line.elements.length, this._gl.UNSIGNED_SHORT, 0);
		} 
	}
	this.drawColorCode = function(useOffset) {
		if (loadQueue != 0) return;
		if (!this._bufferReady) this._initBuffers(gl);
		
		if (this._triangle !== undefined) {
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.coded_color_buffer);
			this._gl.vertexAttribPointer(this._color, 4, this._gl.FLOAT, false,0,0);

			if (useOffset === true) {
			    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.offset_vertex_buffer);
			    this._gl.vertexAttribPointer(this._position, 3, this._gl.FLOAT, false,0,0) ;
			} else {
			    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.vertex_buffer);
			    this._gl.vertexAttribPointer(this._position, 3, this._gl.FLOAT, false,0,0) ;
			}
		    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._triangle.element_buffer);
		    this._gl.drawElements(this._gl.TRIANGLES, this._triangle.elements.length, this._gl.UNSIGNED_SHORT, 0);
		}
	}
	
	this.setRGBA = function(rgba) {
		for (var i = 0; i < this._triangle.vertices.length/3; i++) {
			this._triangle.colors[i*4+0] = rgba[0];
			this._triangle.colors[i*4+1] = rgba[1];
			this._triangle.colors[i*4+2] = rgba[2];
			this._triangle.colors[i*4+3] = rgba[3];
			if (gradient && (this._triangle.vertices[i*3+2] === 0)) {
				this._triangle.colors[i*4+3] = 0.0;
			} 
		}
		
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.color_buffer);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, 
					new Float32Array(this._triangle.colors), 
					this._gl.STATIC_DRAW);
	}
	this.setCWDimming = function(dimming) {
		for (var i = 0; i < this._triangle.vertices.length/3; i++) {
			if (gradient && (this._triangle.vertices[i*3+2] === 0)) {
				this._triangle.colors[i*4+3] = 0.0;
			} else {
				this._triangle.colors[i*4+3] = dimming;
			}
		}
		
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.color_buffer);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, 
					new Float32Array(this._triangle.colors), 
					this._gl.STATIC_DRAW);
	}
	this.setWWDimming = function(dimming) {
		for (var i = 0; i < this._triangle.vertices.length/3; i++) {
			if (gradient && (this._triangle.vertices[i*3+2] === 0)) {
				this._triangle.colors[i*4+3] = 0.0;
			} else {
				this._triangle.colors[i*4+3] = dimming;
			}
		}
		
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.color_buffer);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, 
					new Float32Array(this._triangle.colors), 
					this._gl.STATIC_DRAW);
	}
	this._setColor = function(index, value) {
		for (var i = 0; i < this._triangle.vertices.length/3; i++) {
			this._triangle.colors[i*4+index] = value;
		}
		
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._triangle.color_buffer);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, 
					new Float32Array(this._triangle.colors), 
					this._gl.STATIC_DRAW);
	}
	this.setRed = function(value) {
		this._setColor(0, value);
	}
	this.setGreen = function(value) {
		this._setColor(1, value);
	}
	this.setBlue = function(value) {
		this._setColor(2, value);
	}
}
