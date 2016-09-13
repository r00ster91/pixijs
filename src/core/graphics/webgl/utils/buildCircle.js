import buildLine from './buildLine';
import CONST from '../../../const';
import utils from '../../../utils';

/**
 * Builds a circle to draw
 *
 * Ignored from docs since it is not directly exposed.
 *
 * @ignore
 * @private
 * @param graphicsData {PIXI.WebGLGraphicsData} The graphics object to draw
 * @param webGLData {object} an object containing all the webGL-specific information to create this shape
 */
const buildCircle = function (graphicsData, webGLData)
{
    // need to convert points to a nice regular data
    let circleData = graphicsData.shape;
    let x = circleData.x;
    let y = circleData.y;
    let width;
    let height;

    // TODO - bit hacky??
    if (graphicsData.type === CONST.SHAPES.CIRC)
    {
        width = circleData.radius;
        height = circleData.radius;
    }
    else
    {
        width = circleData.width;
        height = circleData.height;
    }

    let totalSegs = Math.floor(30 * Math.sqrt(circleData.radius)) || Math.floor(15 * Math.sqrt(circleData.width + circleData.height));
    let seg = (Math.PI * 2) / totalSegs ;

    let i = 0;

    if (graphicsData.fill)
    {
        let color = utils.hex2rgb(graphicsData.fillColor);
        let alpha = graphicsData.fillAlpha;

        let r = color[0] * alpha;
        let g = color[1] * alpha;
        let b = color[2] * alpha;

        let verts = webGLData.points;
        let indices = webGLData.indices;

        let vecPos = verts.length/6;

        indices.push(vecPos);

        for (i = 0; i < totalSegs + 1 ; i++)
        {
            verts.push(x,y, r, g, b, alpha);

            verts.push(x + Math.sin(seg * i) * width,
                       y + Math.cos(seg * i) * height,
                       r, g, b, alpha);

            indices.push(vecPos++, vecPos++);
        }

        indices.push(vecPos-1);
    }

    if (graphicsData.lineWidth)
    {
        let tempPoints = graphicsData.points;

        graphicsData.points = [];

        for (i = 0; i < totalSegs + 1; i++)
        {
            graphicsData.points.push(x + Math.sin(seg * i) * width,
                                     y + Math.cos(seg * i) * height);
        }

        buildLine(graphicsData, webGLData);

        graphicsData.points = tempPoints;
    }
};

export default buildCircle;