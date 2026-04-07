import AppKit

let size = NSSize(width: 1024, height: 1024)
let image = NSImage(size: size)

image.lockFocus()

let rect = NSRect(origin: .zero, size: size)
NSColor(calibratedRed: 0.97, green: 0.95, blue: 0.90, alpha: 1.0).setFill()
rect.fill()

let decorSquare1 = NSBezierPath(rect: NSRect(x: 150, y: 320, width: 48, height: 48))
NSColor(calibratedRed: 0.10, green: 0.20, blue: 0.40, alpha: 1.0).setFill()
decorSquare1.fill()

let decorSquare2 = NSBezierPath(rect: NSRect(x: 826, y: 380, width: 48, height: 48))
NSColor(calibratedRed: 1.0, green: 0.60, blue: 0.0, alpha: 1.0).setFill()
decorSquare2.fill()

let decorSquare3 = NSBezierPath(rect: NSRect(x: 900, y: 200, width: 40, height: 40))
NSColor(calibratedRed: 0.15, green: 0.35, blue: 0.60, alpha: 1.0).setFill()
decorSquare3.fill()

let decorSquare4 = NSBezierPath(rect: NSRect(x: 110, y: 180, width: 40, height: 40))
NSColor(calibratedRed: 0.20, green: 0.25, blue: 0.35, alpha: 1.0).setFill()
decorSquare4.fill()

let center = NSPoint(x: 512, y: 450)
let orbitRect = NSRect(x: center.x - 230, y: center.y - 95, width: 460, height: 190)

func strokeOrbit(_ degrees: CGFloat) {
    let orbit = NSBezierPath(ovalIn: orbitRect)
    var transform = AffineTransform()
    transform.translate(x: center.x, y: center.y)
    transform.rotate(byDegrees: Double(degrees))
    transform.translate(x: -center.x, y: -center.y)
    orbit.transform(using: transform)

    NSColor(calibratedRed: 0.38, green: 0.88, blue: 1.0, alpha: 0.95).setStroke()
    orbit.lineWidth = 22
    orbit.lineCapStyle = .round
    orbit.stroke()
}

strokeOrbit(0)
strokeOrbit(60)
strokeOrbit(-60)

let nucleus = NSBezierPath(ovalIn: NSRect(x: center.x - 44, y: center.y - 44, width: 88, height: 88))
NSColor(calibratedRed: 0.38, green: 0.88, blue: 1.0, alpha: 1.0).setFill()
nucleus.fill()

let masterAttrs: [NSAttributedString.Key: Any] = [
    .font: NSFont.systemFont(ofSize: 88, weight: .bold),
    .foregroundColor: NSColor(calibratedRed: 1.0, green: 0.60, blue: 0.0, alpha: 1.0),
]

let masterRect = NSRect(x: 0, y: 200, width: 1024, height: 110)
let masterParagraph = NSMutableParagraphStyle()
masterParagraph.alignment = .center
var masterFinalAttrs = masterAttrs
masterFinalAttrs[NSAttributedString.Key.paragraphStyle] = masterParagraph
("Master" as NSString).draw(in: masterRect, withAttributes: masterFinalAttrs)

let reactAttrs: [NSAttributedString.Key: Any] = [
    .font: NSFont.systemFont(ofSize: 68, weight: .semibold),
    .foregroundColor: NSColor(calibratedRed: 0.10, green: 0.20, blue: 0.40, alpha: 1.0),
]

let reactRect = NSRect(x: 0, y: 760, width: 1024, height: 100)
let reactParagraph = NSMutableParagraphStyle()
reactParagraph.alignment = .center
var reactFinalAttrs = reactAttrs
reactFinalAttrs[NSAttributedString.Key.paragraphStyle] = reactParagraph
("React Native" as NSString).draw(in: reactRect, withAttributes: reactFinalAttrs)

image.unlockFocus()

guard let tiff = image.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiff),
      let pngData = bitmap.representation(using: .png, properties: [:]) else {
    fatalError("Could not create PNG data")
}

let outputURL = URL(fileURLWithPath: "/Users/sam/Projects/Master-react-native/mobile-app/assets/icon.png")
try pngData.write(to: outputURL)
print("Wrote \(outputURL.path)")
