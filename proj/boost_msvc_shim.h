#ifndef YAMY_BOOST_MSVC_SHIM_H
#define YAMY_BOOST_MSVC_SHIM_H

//
// Boost 1.38 の boost/regex/v4/regex_workaround.hpp は、MSVC 8 (VC2005)
// 以降のコンパイラで std::copy / std::equal の代わりに
// stdext::unchecked_copy / stdext::unchecked_equal を使うワークアラウンドを
// 持っている。しかし、これらの内部関数は新しい MSVC の標準ライブラリでは
// 削除されており、そのままビルドすると C3861 等のエラーになる。
//
// ここで std::copy / std::equal へ委譲するシムを提供して回避する。
// 本ヘッダは全ソースへ /FI (ForcedIncludeFiles) で先頭インクルードされる。
//
#if defined(_MSC_VER)

#include <algorithm>

//
// Boost 1.38 の w32_regex_traits.hpp などは、テンプレート化された
// イテレータコンストラクタ (例: std::string(p1, p2)) を使う箇所がある。
// p1/p2 が const wchar_t* の場合、最新 MSVC の標準ライブラリは
// wchar_t -> char の暗黙変換を拒否するためコンパイルエラーになる。
// このマクロを定義すると、Boost は1文字ずつ char() で明示変換する
// 安全なフォールバックパスを使うようになる。
//
#ifndef BOOST_NO_TEMPLATED_ITERATOR_CONSTRUCTORS
#define BOOST_NO_TEMPLATED_ITERATOR_CONSTRUCTORS
#endif

namespace stdext {

template<class InputIterator, class OutputIterator>
inline OutputIterator unchecked_copy(InputIterator first, InputIterator last, OutputIterator dest)
{
	return std::copy(first, last, dest);
}

template<class InputIterator1, class InputIterator2>
inline bool unchecked_equal(InputIterator1 first, InputIterator1 last, InputIterator2 with)
{
	return std::equal(first, last, with);
}

} // namespace stdext

#endif // _MSC_VER

#endif // YAMY_BOOST_MSVC_SHIM_H
