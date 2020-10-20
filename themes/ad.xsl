<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" 
                xmlns:math="http://exslt.org/math"
                extension-element-prefixes="math">
  
  <xsl:param name="cms-server" select="''"/>
  
  <xsl:template match="/body[contains(@class, 'agregator')]//div[contains(@class, 'part')][last() - position() &gt; 4][position() mod 3 = 2]//h2">
    <xsl:variable name="rand"><xsl:value-of select="floor(math:random()*6) + 1" /></xsl:variable>
    [!!]
<!--     <xsl:if test="math:random() &lt; 0.3"> -->
    <xsl:if test="$cms-server = ''">
      <div class="list"><ul class="ad">
        <xsl:choose>
          <xsl:when test="$rand = 0">
            <li>Chcete tento a další články tohoto webu do své čtečky?</li>
            <li><a href="#ebook" class="button button--simple button--img button--img-inline"><span class="fab fa-fw fa-atlas">i</span> Chci e-book</a></li>
          </xsl:when>
          <xsl:when test="$rand = 1">
            <li>Koupí e-booku podpoříte autora a další rozvoj tohoto webu.</li>
            <li><a href="#ebook" class="button button--simple button--img button--img-inline"><span class="fab fa-fw fa-atlas">i</span> Koupit e-book</a></li>
          </xsl:when>
          <xsl:when test="$rand = 2">
            <li>Pomáhají Vám naše články a chcete je mít vždy při sobě?</li>
            <li><a href="#ebook" class="button button--simple button--img button--img-inline"><span class="fab fa-fw fa-atlas">i</span> E-book nebo PDF</a></li>
          </xsl:when>
          <xsl:when test="$rand = 3">
            <li>Baví Vás číst naše články a chcete podpořit další rozvoj?</li>
            <li><a href="#ebook" class="button button--simple button--img button--img-inline"><span class="fab fa-fw fa-atlas">i</span> Objednat e-book</a></li>
          </xsl:when>
          <xsl:when test="$rand = 4">
            <li>Koupí e-booku potěšíte svého známého a také autora článků.</li>
            <li><a href="#ebook" class="button button--simple button--img button--img-inline"><span class="fab fa-fw fa-atlas">i</span> Potěšit známého</a></li>
          </xsl:when>
          <xsl:when test="$rand = 5">
            <li>Líbí se Vám naše články a chcete podpořit autora koupí e-booku?</li>
            <li><a href="#ebook" class="button button--simple button--img button--img-inline"><span class="fab fa-fw fa-atlas">i</span> Podpořit autora</a></li>
          </xsl:when>
          <xsl:when test="$rand = 6">
            <li>Zajímá Vás nová elektronická kniha jako sborník článků tohoto webu?</li>
            <li><a href="#ebook" class="button button--simple button--img button--img-inline"><span class="fab fa-fw fa-atlas">i</span> Elektronická kniha</a></li>
          </xsl:when>
        </xsl:choose>
      </ul></div>
    </xsl:if>
<!--     </xsl:if> -->
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
