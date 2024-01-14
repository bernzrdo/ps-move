# <img src="https://i.imgur.com/7kBgBXz.png" height="16" alt="PlayStation Move"> ps-move

Interface with the **Playstation Move motion controller**. This module can receive inputs and set the LED color and rumble.

## Example

```ts
import { PSMove } from 'ps-move';

const move = new PSMove(()=>console.log('Ready!'));

move.on('data', data=>{

    if(data.triangle){
        move.hex('d64462');
        move.update();
    }

    if(data.square){
        move.hsl(35, .95, .63);
        move.update();
    }

    if(data.circle){
        move.rumble(.5);
        move.update();
    }

});
```

## Pairing

You can pair using the [PS Move API](https://thp.io/2010/psmove/). **It is recommended to follow [their documentation](https://psmoveapi.readthedocs.io/)**, although here's a summary of the steps I took:

1. Download and extract a [PS Move API GitHub Release](https://github.com/thp/psmoveapi/releases/latest).
2. Run a terminal as **administrator**.
3. Navigate to the **bin** directory inside of the extracted folder.
4. Connect your controller with USB.
5. Execute `psmove pair`.
6. **Done!**

If you have any trouble, consult the [PS Move API Documentation](https://psmoveapi.readthedocs.io/).

## Installation

Install using npm:

```
npm i ps-move
```

## API

### `PSMove`

The main class representing the PlayStation Move motion controller.

```ts
const move = new PSMove(()=>console.log('Ready!'));
```

On the constructor, you can pass a function that will be triggered when the instance is ready.

### Methods

#### `hex()`, `rgb()`, `hsl()`

Gets and sets the color of the LED. Use `update()` to apply the set color.

```ts
move.hex() // #000000
move.hex('#b16570');

move.rgb() // [177, 101, 112]
move.rgb(199, 210, 39);

move.hsl() // [63.85, 0.68, 0.48]
move.hsl(124, .76, .7);
```

#### `rumble()`

Gets and sets the rumble (vibration) of the controller. Must be a number from 0 to 1. Use `update()` to apply the set rumble.

```ts
move.rumble() // 0
move.rumble(.75);
```

#### `update()`

Send a message to the controller with the set color and the set rumble. It returns a `Promise<boolean>` to inform the success of the update.

```ts
if(await move.update()){
    console.log('Success!');
}else{
    console.log('Fail!');
}
```

### Events

#### `data`

Emits a [`Data`](#data-1) object about the controller. This happens multiple times per second.

```ts
move.on('data', data=>{
    // Do something
});
```

### Interfaces

#### `Data`

| Name            | Type                  | Description                                                                      |
|-----------------|-----------------------|----------------------------------------------------------------------------------|
| `select`        | `boolean`             | **SELECT** button                                                                |
| `start`         | `boolean`             | **START** button                                                                 |
| `square`        | `boolean`             | <img src="https://i.imgur.com/ckIVj5l.png" height="12" alt="Square"> button      |
| `cross`         | `boolean`             | <img src="https://i.imgur.com/aNg4wYr.png" height="12" alt="Cross"> button       |
| `circle`        | `boolean`             | <img src="https://i.imgur.com/4JVQs7b.png" height="12" alt="Circle"> button      |
| `triangle`      | `boolean`             | <img src="https://i.imgur.com/90NqScg.png" height="12" alt="Triangle"> button    |
| `ps`            | `boolean`             | <img src="https://i.imgur.com/vXTv3PZ.png" height="12" alt="PlayStation"> button |
| `move`          | `boolean`             | <img src="https://i.imgur.com/7kBgBXz.png" height="12" alt="Move"> button        |
| `trigger`       | `number`              | **Trigger (T)** button pressure from 0 to 1                                      |
| `battery`       | [`Battery`](#battery) | Battery information                                                              |
| `accelerometer` | [`Vector3`](#vector3) | Vector of the accelerometer                                                      |
| `gyroscope`     | [`Vector3`](#vector3) | Vector of the gyroscope                                                          |

#### `Battery`

| Name             | Type               | Description                                                                  |
|------------------|--------------------|------------------------------------------------------------------------------|
| `level`          | `number` or `null` | The battery level from 0 to 5. When charging, it is unknown so it is `null`. |
| `chargingStatus` | `string`           | Returns `not_charging`, `charging` or `fully_charged`.                       |

#### `Vector3`

| Name | Type     |
|------|----------|
| `x`  | `number` |
| `y`  | `number` |
| `z`  | `number` |

## Acknowledgments

This project wouldn't be possible without the help of the [PS Move API](https://thp.io/2010/psmove/). **Thank you to [@thp](https://github.com/thp)! ❤️**

## License

[MIT © bernzrdo](./LICENSE)