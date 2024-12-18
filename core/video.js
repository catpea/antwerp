import fs from "fs-extra";
import path from "path";
import invariant from "invariant";
import sharp from "sharp";
import { last, head, get, set } from "lodash-es";
import log from "../util/log.js";
import progress from "../util/progress.js";

import util from "util";
import child_process from "child_process";
const execFile = util.promisify(child_process.execFile);

export default async function video({ db, configuration: { video } }, options) {
  log.info("Converting Audio To Video");
  await fs.ensureDir(video);
  const selected = [];
  for (const record of db) {
    const featureRequested =
      record.attr.features.video && record.attr.audio && record.attr.image;
    const dest = path.join(video, record.attr.id + ".mp4");
    const exists = await fs.pathExists(dest);
    if (featureRequested && !exists) selected.push(record);
  }
  const bar = progress(
    `generating video`,
    `[:bar] :rate/tps :percent :etas`,
    selected.length,
    options.progress,
  );
  for (const record of selected) {
    await makeVideo(record, video);
    bar.tick();
  }
}

async function makeVideo(record, video) {
  const dest = path.join(video, record.attr.id + ".mp4");
  const audio = path.join(record.src, "files", record.attr.audio);
  const image = path.join(record.src, "files", "lg-" + record.attr.image);
  try {
    const command = "ffmpeg";

    // const commandArguments = [
    //   "-hide_banner",
    //   "-loglevel",
    //   "panic",
    //   "-y",
    //   "-loop",
    //   "1",
    //   "-framerate",
    //   "1", // 1/60 made the video twice as slong with silence at the end
    //   "-i",
    //   image,
    //   "-i",
    //   audio,
    //   "-c:v",
    //   "h264",
    //   // 'libx264',
    //   // '-preset', 'ultrafast',
    //   "-vf",
    //   `scale=720:-1'`,
    //   // '-vf', `scale=-2:'min(720,ih)'`,
    //   "-tune",
    //   "stillimage",
    //   "-c:a",
    //   "aac",
    //   "-b:a",
    //   "192k",
    //   "-pix_fmt",
    //   "yuv420p",
    //   "-shortest",
    //   dest,
    // ];

    const commandArguments = [
      "-hide_banner",
      "-loglevel","panic",
      "-y",
      "-framerate", "0.2",
      "-loop","1",
      "-i", image,
      "-i", audio,
      "-c:v","h264",
      "-tune", "stillimage",
      "-shortest",
      dest,
    ];

    console.log(command, commandArguments.join(" "));
    const { stdout } = await execFile(command, commandArguments);
    if (stdout) console.log(stdout);
  } catch (e) {
    console.log(e);
  }
}
