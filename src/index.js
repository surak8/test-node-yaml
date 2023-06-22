/* eslint-disable no-unused-vars */
// https://www.npmjs.com/package/node-yaml
const test=require('node-yaml');
const path=require('path');
const fs=require('fs');

// #region
//import {read} from "node-yaml"
const FNAME1=path.resolve('./stuff/simple-fruits.yaml');

/**
 * Show the contents of a single file.
 * @param {string} afilename filename to display
 */
async function readAFile(afilename){
	if (afilename){
		if (fs.existsSync(afilename)){
			console.log(`reading: ${afilename}`);
			//var v=await test.read(FNAME1)
			//	.then(res => console.log('File content:\n\n%s', JSON.stringify(res, null, 2)))
			//	.catch(err => console.error('Error while reading file:\n\n%s', String(err)));
			var v2=await test.readSync(afilename,{is_opts:true});
			//.then(res => console.log('File content:\n\n%s', JSON.stringify(res, null, 2)))
			//.catch(err => console.error('Error while reading file:\n\n%s', String(err)));
			console.log('file-content:'+JSON.stringify(v2,null,4));
		}	else
			console.warn(`non-existent: ${afilename}`);
	}else
		console.warn('no filename specified');
}

async function mkDirFromFile(fname)
{
	var dir;

	if (fname)
		if (!fs.existsSync(dir=path.dirname(fname))) {
			fs.mkdirSync(dir,{recursive:true});
			return true;
		}
	return false;
}
async function writeYamlFile(){
	const OUT_FNAME='my-yaml-file.yaml';
	var fname,dir,v;

	fname=path.resolve(path.join(process.cwd(),'out',OUT_FNAME));
	mkDirFromFile(fname);
	v=await test.writeSync(fname ,{'fruits':['apple','orange','pear']});
	console.log(`wrote: ${fname}`);
}

function writeFruits(fname){
	var fullPath=path.resolve(fname),dir;

	if (!fs.existsSync(dir=path.dirname(fullPath))) fs.mkdirSync(dir,{recursive:true});
	test
		.write(fullPath, {'fruits':['apple','orange','pear']})
		.then((msg)=> console.log(`wrote: ${fullPath}`) )
		.catch((err)=> console.log(err.message));
}
// #endregion

function openApiVersion(obj,version){
	obj['openapi']=version;
}

function createInfo(obj,who,email,version='1.0.0'){
	obj['info']={
		'title':'a-title',
		'version':version,
		'description':'a-description',
		'contact':{'name':who,'email':email},
		'license':{ 'name':'MIT'}
	};
}
function createServers(anObj,hostname,prefix,port){
	anObj['servers']=
		[
			{'url':'http://{hostname}:{port}/{prefix}',
				'description':'some description',
				'variables':{
					'hostname':{
						'default':hostname||'localhost',
						'description':'description of hostname'
					},
					'prefix':{
						'default':prefix||'node',
						'description':'description of prefix'
					},
					'port':{
						'enum':[
							`${port||5001}`,
							'9998','9999'
						],
						'default':`${port||5001}`,
						'description':'description of port'
					}},
			}
		];
}
function createPaths(anObj){
	anObj['paths']=
		{
			'/user':{
				'get':{
					'summary':'a-summary',
					'description':'a-description',
					'responses':{
						'200':{
							'description':'a-description'
						}
					}
				}
			}
		};
}

async function writeAProject(fname){
	var anObj={},fname2;
	openApiVersion(anObj,'3.0.3'),
	createInfo(anObj,'rik cousens','rcousens@colt.com'),
	createServers(anObj,
		process.env['COMPUTERNAME'],
		'/riktest/node',
		6666
	),
	createPaths(anObj);
	fname2=path.resolve(fname);
	mkDirFromFile(fname2);
	test.write(fname2,anObj	)
		.then((msg)=> console.log(`wrote: ${fname2}`) )
		.catch((err)=> console.log(err.message) );
}

async function rewriteAsYaml(afile,outDir){
	const infile=path.resolve(afile);
	const theOutDir=path.resolve(outDir||path.join(process.cwd(),'out'));
	var yamlFile,content;

	yamlFile=path.join(
		theOutDir,
		path.basename(infile,path.extname(infile))+'.yaml');

	if (fs.existsSync(infile)){
		mkDirFromFile(yamlFile);
		console.log(`read: ${infile}`);
		content=await test.readSync(infile);
		await test.writeSync(yamlFile,content);
		console.log(`wrote: ${yamlFile}`);
	}else
		console.warn(`non-existent: ${infile}`);
}

async function main(){
	try {
		await readAFile(FNAME1); // dump contents of a single file.
		//await readAFile(path.resolve('./stuff/json/seb-test.yaml.json'));
		await readAFile(path.resolve('./stuff/seb-test.json'));
		await writeFruits('./out/fruits.rik.yaml');	// write a yaml-file.
		await writeYamlFile();
		await writeAProject('./out/riktest.yaml');
		await rewriteAsYaml('./stuff/q7.json','./out');
		await rewriteAsYaml('./stuff/node-query-generator.json','./out');
	}catch(anException) {
		console.error(anException.message);
		console.error(anException);
	}finally{
		console.log('done');
	}
}

main();