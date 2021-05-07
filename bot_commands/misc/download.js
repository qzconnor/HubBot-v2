const { Command, util } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const readline = require('readline');
const fs = require('fs');
const ffmpeg = require("fluent-ffmpeg");
const ffmpegs = require('ffmpeg-static');
const cp = require('child_process');

module.exports = class JoinCommand extends Command{
    constructor(client){
        super(client,{
            name: 'download',
            aliases: ['dl'],
            group: 'misc',
            memberName: 'download',
            description: 'Download video Command.',
            argsType: 'multiple'
        })
    }
    async run(message,args){
        if(args.length == 0){
            let embed = new MessageEmbed()
            .setTitle("Fehler - Bitte gebe eine gültige URL an!")
            .setColor(this.client.errorColor)
            return message.say(embed);
        }
       let id = args[0];
       let type = args[1];
       if(type == "mp3"){
        let stream = ytdl(id, {
            quality: 'highestaudio',
          });
          
          let rdmid = makeid(5);

            let start = Date.now();
            ffmpeg(stream)
            .audioBitrate(128)
            .save(`resource/${id}_${rdmid}.mp3`)
            .on('start', () =>{
                let embed = new MessageEmbed()
                .setTitle(`Start downloading - ID: ${id} - MP3`)
                .setColor(this.client.succesColor)
                message.say(embed);
            })
            .on('end', () => {
                let embed = new MessageEmbed()
                .setTitle(`done - ${(Date.now() - start) / 1000}s`)
                .setColor(this.client.succesColor)
                message.say(embed);
                message.say({
                    files: [`resource/${id}_${rdmid}.mp3`]
                }).then(()=>{
                    fs.unlink(`resource/${id}_${rdmid}.mp3`, () => {
                        console.log("File removed!");
                    });
                });
            });

       }else if(type == "mp4"){

        let rdmid = makeid(5);

        const tracker = {
            start: Date.now(),
            audio: { downloaded: 0, total: Infinity },
            video: { downloaded: 0, total: Infinity },
            merged: { frame: 0, speed: '0x', fps: 0 },
          };
          
          // Get audio and video streams
          const audio = ytdl(`https://www.youtube.com/watch?v=${id}`, { quality: 'highestaudio' })
            .on('progress', (_, downloaded, total) => {
              tracker.audio = { downloaded, total };
            });
          const video = ytdl(`https://www.youtube.com/watch?v=${id}`, { quality: 'highestvideo' })
            .on('progress', (_, downloaded, total) => {
              tracker.video = { downloaded, total };
            });
          
          // Prepare the progress bar
          let progressbarHandle = null;
          const progressbarInterval = 1000;

          let runfor;

          const datapro = () => {
            runfor = ((Date.now() - tracker.start) / 1000 / 60).toFixed(2);
          };
        
          // Start the ffmpeg child process
          const ffmpegProcess = cp.spawn(ffmpegs, [
            // Remove ffmpeg's console spamming
            '-loglevel', '8', '-hide_banner',
            // Redirect/Enable progress messages
            '-progress', 'pipe:3',
            // Set inputs
            '-i', 'pipe:4',
            '-i', 'pipe:5',
            // Map audio & video from streams
            '-map', '0:a',
            '-map', '1:v',
            // Keep encoding
            '-c:v', 'copy',
            // Define output file
            `resource/${id}_${rdmid}.mkv`,
          ], {
            windowsHide: true,
            stdio: [
              /* Standard: stdin, stdout, stderr */
              'inherit', 'inherit', 'inherit',
              /* Custom: pipe:3, pipe:4, pipe:5 */
              'pipe', 'pipe', 'pipe',
            ],
          });
          ffmpegProcess.on('close', () => {
            console.log(`done - ${runfor}`);
            // Cleanup
            //process.stdout.write('\n\n');
            clearInterval(progressbarHandle);

            let embed = new MessageEmbed()
            .setTitle(`done - ${runfor} min.`)
            .setColor(this.client.succesColor)
            message.say(embed);
          });
          ffmpegProcess.stdio[3].once('data', () => {

            let embed = new MessageEmbed()
            .setTitle(`Start downloading - ID: ${id} - MP4`)
            .setColor(this.client.succesColor)
            message.say(embed);
          });



          // Link streams
          // FFmpeg creates the transformer streams and we just have to insert / read data
          ffmpegProcess.stdio[3].on('data', chunk => {
            // Start the progress bar
            if (!progressbarHandle) progressbarHandle = setInterval(datapro, progressbarInterval);
            // Parse the param=value list returned by ffmpeg
            const lines = chunk.toString().trim().split('\n');
            const args = {};
            for (const l of lines) {
              const [key, value] = l.split('=');
              args[key.trim()] = value.trim();
            }
            tracker.merged = args;
          });
          audio.pipe(ffmpegProcess.stdio[4]);
          video.pipe(ffmpegProcess.stdio[5]);





       }else{
        let embed = new MessageEmbed()
        .setTitle("Fehler - Bitte gebe ein gültigen Typ an! [mp3/mp4]")
        .setColor(this.client.errorColor)
        return message.say(embed);
       }
      
    }
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 